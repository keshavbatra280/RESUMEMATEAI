import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import resumeRoutes from "./routes/resume.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") }); // root .env
dotenv.config(); // also allow server/.env (e.g. on Render)

const app = express();
const origins = (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(",").map((s) => s.trim());

app.use(cors({ origin: origins }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", aiConfigured: Boolean(process.env.OPENAI_API_KEY) })
);
app.use("/api", resumeRoutes);

app.use((req, res) => res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` }));
app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.code === "LIMIT_FILE_SIZE" ? 413 : err.status || 500;
  res.status(status).json({ error: err.code === "LIMIT_FILE_SIZE" ? "File is larger than 5 MB." : err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`ResumeMate AI server running on http://localhost:${PORT}`);
  if (!process.env.OPENAI_API_KEY) console.warn("WARNING: OPENAI_API_KEY is not set. Copy .env.example to .env and add your key.");
});
