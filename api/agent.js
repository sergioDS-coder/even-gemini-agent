import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Accetta solo richieste POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Verifica il token di autenticazione
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  if (!process.env.AGENT_TOKEN || token !== process.env.AGENT_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Legge la query inviata dagli occhiali
  const { query } = req.body;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Missing query" });
  }

  try {
    // Inizializza il client Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 300, // risposta breve, adatta al display HUD
        temperature: 0.7,
      },
    });

    // Prompt di sistema: risposta concisa per il display degli occhiali
    const fullPrompt = `Sei un assistente vocale integrato in occhiali smart. 
Rispondi in modo CONCISO (max 2-3 frasi), chiaro, diretto. 
Niente elenchi lunghi, niente markdown. Solo testo semplice.

Domanda: ${query}`;

    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();

    return res.status(200).json({ response: text });
  } catch (error) {
    console.error("Gemini error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
