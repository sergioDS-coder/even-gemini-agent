import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * POST /api/transcribe
 * Riceve una nota vocale (WAV base64) dal microfono degli occhiali G2, la
 * trascrive e la struttura come voce di diario tecnico con Gemini 2.5 Flash
 * (multimodale) in un'unica chiamata.
 *
 *   Auth:     header `Authorization: Bearer <AGENT_TOKEN>`
 *   Request:  { "audio": "<base64 WAV>", "mimeType": "audio/wav" }
 *   Response: { "response": "<nota strutturata>" }
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Stessa autenticazione di /api/agent
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  if (!process.env.AGENT_TOKEN || token !== process.env.AGENT_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { audio, mimeType } = req.body || {};
  if (!audio || typeof audio !== "string") {
    return res.status(400).json({ error: "Missing audio" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { maxOutputTokens: 200, temperature: 0.4 },
    });

    const prompt =
      "Sei l'assistente di un ingegnere strutturale italiano. In allegato trovi una " +
      "nota vocale in italiano dettata dal campo. Trascrivila e strutturala come " +
      "voce di diario tecnico: massimo 2 righe, inizia con un verbo all'infinito " +
      '(es. "Verificare...", "Contattare...", "Aggiornare..."). Rispondi SOLO con ' +
      "la nota strutturata, senza preamboli.";

    const result = await model.generateContent([
      { text: prompt },
      { inlineData: { mimeType: mimeType || "audio/wav", data: audio } },
    ]);

    const text = result.response.text();
    return res.status(200).json({ response: text });
  } catch (error) {
    console.error("Transcribe error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
