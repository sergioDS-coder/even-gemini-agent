# 🕶️ Even Realities G1/G2 — Agente Gemini su Vercel
## Guida completa passo passo

---

## COSA SUCCEDE IN PRATICA

Parli agli occhiali → gli occhiali inviano la tua domanda al tuo server su Vercel →
Vercel la gira a Gemini → Gemini risponde → Vercel restituisce la risposta agli occhiali →
il testo appare sul HUD.

---

## FASE 1 — Ottieni la chiave API di Google Gemini (gratuita)

1. Vai su https://aistudio.google.com
2. Accedi con il tuo account Google
3. In alto a sinistra clicca su **"Get API key"**
4. Clicca **"Create API key"** → scegli **"Create API key in new project"**
5. Copia la chiave e salvala in un posto sicuro (es. Note dell'iPhone)
   → Assomiglia a: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX`

---

## FASE 2 — Crea un account GitHub (se non ce l'hai)

1. Vai su https://github.com e clicca **"Sign up"**
2. Inserisci email, password, username
3. Verifica l'email

---

## FASE 3 — Carica il progetto su GitHub

### Opzione A — Dal browser (più semplice)

1. Vai su https://github.com/new
2. **Repository name**: `even-gemini-agent`
3. Lascia tutto il resto di default → clicca **"Create repository"**
4. Nella pagina vuota che appare, clicca **"uploading an existing file"**
5. Carica i 3 file dalla cartella del progetto:
   - `api/agent.js`  ← prima crea la cartella "api" trascinandola
   - `package.json`
   - `vercel.json`

> ⚠️ Per creare la cartella `api`: nel nome del file scrivi `api/agent.js`
> GitHub creerà automaticamente la sottocartella.

6. Clicca **"Commit changes"**

---

## FASE 4 — Crea un account Vercel e collega GitHub

1. Vai su https://vercel.com
2. Clicca **"Sign Up"** → scegli **"Continue with GitHub"**
3. Autorizza Vercel ad accedere al tuo GitHub
4. Una volta dentro, clicca **"Add New Project"**
5. Nella lista dei repository trova **"even-gemini-agent"** e clicca **"Import"**
6. Nella schermata di configurazione NON toccare nulla → clicca **"Deploy"**
7. Aspetta ~60 secondi → vedrai un'animazione di deployment
8. ✅ Quando appare "Congratulations!" il server è live!

---

## FASE 5 — Aggiungi le variabili d'ambiente (i tuoi segreti)

Queste variabili sostituiscono le chiavi nel codice, senza esporle pubblicamente.

1. Nel tuo progetto su Vercel, vai su **Settings → Environment Variables**
2. Aggiungi la prima variabile:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: incolla la chiave copiata al Passo 1
   - Clicca **"Save"**
3. Aggiungi la seconda variabile:
   - **Name**: `AGENT_TOKEN`
   - **Value**: inventa una password segreta qualsiasi, es. `sergio-occhiali-2025`
   - Clicca **"Save"**
4. Vai su **Deployments** → clicca sul deployment più recente → **"Redeploy"**
   (necessario per applicare le variabili)

---

## FASE 6 — Recupera il tuo URL pubblico

1. Nella dashboard Vercel del tuo progetto, in alto trovi il tuo URL:
   → `https://even-gemini-agent-XXXX.vercel.app`
2. Il tuo endpoint completo sarà:
   → `https://even-gemini-agent-XXXX.vercel.app/api/agent`
3. Copialo.

---

## FASE 7 — Configura l'app Even Realities

1. Apri l'app **Even AI** sul tuo iPhone
2. Vai nella sezione agenti → **"Add Agent"**
3. Compila i campi:
   - **Name**: `Gemini`
   - **URL**: `https://even-gemini-agent-XXXX.vercel.app/api/agent`
   - **Token**: `sergio-occhiali-2025`  ← la password che hai scelto al Passo 5
4. Clicca **"Save"**

---

## FASE 8 — Testa che funzioni

Prima di usarlo sugli occhiali, verifica dal terminale del Mac:

```bash
curl -X POST https://even-gemini-agent-XXXX.vercel.app/api/agent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sergio-occhiali-2025" \
  -d '{"query": "Qual è la capitale della Francia?"}'
```

Dovresti ricevere:
```json
{"response": "La capitale della Francia è Parigi."}
```

Se arriva questa risposta, tutto funziona. ✅

---

## RISOLUZIONE PROBLEMI COMUNI

| Problema | Causa | Soluzione |
|---|---|---|
| `401 Unauthorized` | Token sbagliato | Controlla che il Token nell'app corrisponda ad `AGENT_TOKEN` su Vercel |
| `500 Internal Server Error` | Chiave Gemini errata | Controlla `GEMINI_API_KEY` nelle env variables di Vercel |
| Nessuna risposta | URL sbagliato | Copia di nuovo l'URL dalla dashboard Vercel |
| Risposta lenta | Normale al primo avvio | La funzione si "scalda" alla prima chiamata (cold start ~2s) |

---

## COSTI

- **Vercel**: gratuito (piano Hobby, 100GB bandwidth/mese)
- **Gemini API**: gratuito fino a 1.500 richieste/giorno con Gemini Flash
- **Totale**: €0 per uso personale

---

## STRUTTURA FILE DEL PROGETTO

```
even-gemini-agent/
├── api/
│   └── agent.js      ← il cervello: riceve query, chiama Gemini, risponde
├── package.json      ← dipendenze Node.js
└── vercel.json       ← configurazione del server
```
