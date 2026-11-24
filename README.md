# ResumeMate AI – Resume Analyzer & Job Matcher

React + Tailwind frontend, Node/Express backend, OpenAI GPT-4o. Compares a resume with a job description and returns an explainable 100-point score, skill gaps, rewritten bullets and prioritized recommendations. No login, no database.

## Structure
```
client/   React (Vite) + Tailwind UI
server/   Express API
  prompts/   analysisPrompt.js  improvementPrompt.js  recommendationPrompt.js  (the 3 prompts)
  routes/    resume.js  (POST /api/extract, POST /api/analyze)
  services/  openai.js
.env.example   .gitignore   PROMPTS.md (prompt text for the report)
```

## 1. Install (Node.js 18+ required)
```bash
cd server && npm install
cd ../client && npm install
```

## 2. Configure the OpenAI API key
```bash
# from the project root
cp .env.example .env          # Windows: copy .env.example .env
```
Open `.env` and set `OPENAI_API_KEY=sk-...` (create a key at https://platform.openai.com/api-keys; the account needs billing/credit). The key is only read by the server and is never sent to the browser. `.env` is git-ignored.

## 3. Run locally (two terminals)
```bash
# Terminal 1
cd server && npm start        # http://localhost:5000  (check /api/health)
# Terminal 2
cd client && npm run dev      # http://localhost:5173
```
Open http://localhost:5173. Vite proxies `/api` to the server, so no extra config is needed.

## 4. Test every feature
1. **Home** – heading, description, "Analyze My Resume" opens the input page.
2. **Validation** – click "Analyze Resume" with empty boxes: red messages appear for both fields.
3. **Sample data** – click "Load sample data", then "Analyze Resume". A loading screen appears for ~15–30 s.
4. **Dashboard** – check the score ring, 5-part rubric with reasons, green/orange/red skill chips (hover for evidence), strengths and improvement cards, 3–5 recommendations, improved bullets (with "Copy improved text").
5. **File upload** – upload a text-based PDF or a .txt resume; the text fills the resume box. A scanned-image PDF or other file type shows a clear error.
6. **Error handling** – stop the server and analyze: "Cannot reach the server" message. Remove the API key and restart: a clear key message.
7. **Reset** – "Analyze Another Resume" returns to an empty form.
8. **Responsive** – resize the browser or use DevTools device mode (mobile/tablet/desktop).
9. **Honesty check** – read the improved bullets: no new numbers or skills should appear; missing details show up as questions.

## 5. Deploy (free)
Vercel hosts the frontend; the Express server needs a Node host such as **Render**.

**Backend on Render**
1. Push the project to GitHub.
2. Render → New → Web Service → select the repo. Root Directory: `server`. Build: `npm install`. Start: `npm start`.
3. Environment variables: `OPENAI_API_KEY`, `OPENAI_MODEL=gpt-4o`, `CLIENT_ORIGIN=https://<your-vercel-app>.vercel.app` (add after step below, then redeploy).
4. Copy the service URL, e.g. `https://resumemate-api.onrender.com`. (Free instances sleep; the first request can take ~30 s.)

**Frontend on Vercel**
1. Vercel → Add New Project → import the repo. Root Directory: `client`. Framework: Vite (auto-detected).
2. Environment variable: `VITE_API_URL=https://resumemate-api.onrender.com` (no trailing slash).
3. Deploy, then put the Vercel URL into `CLIENT_ORIGIN` on Render.

## 6. The three prompt templates
See **PROMPTS.md** (full text for your report) or the files in `server/prompts/`. Flow: Prompt 1 → analysis and rubric scores (server sums them to the final score) → Prompts 2 and 3 run in parallel using that analysis. All use JSON mode and temperature 0.2 for consistency.

## Troubleshooting
- *401 / key error* – wrong or missing `OPENAI_API_KEY`; restart the server after editing `.env`.
- *429* – no credit or rate limit on your OpenAI account.
- *CORS error in production* – `CLIENT_ORIGIN` must exactly match the Vercel URL (no trailing slash).
