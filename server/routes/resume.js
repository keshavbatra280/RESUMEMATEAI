import { Router } from "express";
import multer from "multer";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import { runPrompt } from "../services/openai.js";
import { buildAnalysisPrompt, finalizeAnalysis } from "../prompts/analysisPrompt.js";
import { buildImprovementPrompt } from "../prompts/improvementPrompt.js";
import { buildRecommendationPrompt } from "../prompts/recommendationPrompt.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const MAX_CHARS = 15000;

const bad = (res, msg) => res.status(400).json({ error: msg });

// POST /api/extract  (multipart, field "file") -> { text }
router.post("/extract", upload.single("file"), async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) return bad(res, "No file received. Choose a PDF or TXT file.");
    const name = file.originalname.toLowerCase();
    let text = "";
    if (name.endsWith(".pdf") || file.mimetype === "application/pdf") {
      text = (await pdfParse(file.buffer)).text;
    } else if (name.endsWith(".txt") || file.mimetype === "text/plain") {
      text = file.buffer.toString("utf-8");
    } else {
      return bad(res, "Unsupported file type. Please upload a PDF or TXT file.");
    }
    text = text.replace(/\r/g, "").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
    if (text.length < 30) return bad(res, "Could not read any text from this file. It may be a scanned image — paste the text instead.");
    res.json({ text });
  } catch (err) {
    err.status = err.status || 400;
    err.message = "Could not read that file: " + err.message;
    next(err);
  }
});

// POST /api/analyze  { resume, jobDescription } -> full result
router.post("/analyze", async (req, res, next) => {
  try {
    const resume = (req.body.resume || "").trim();
    const jobDescription = (req.body.jobDescription || "").trim();
    if (!resume) return bad(res, "Resume is empty. Paste your resume or upload a file.");
    if (!jobDescription) return bad(res, "Job description is empty. Paste the job or internship description.");
    if (resume.length < 50) return bad(res, "Resume looks too short to analyze. Add more detail.");
    if (resume.length > MAX_CHARS || jobDescription.length > MAX_CHARS) return bad(res, `Each input must be under ${MAX_CHARS.toLocaleString()} characters.`);

    // PROMPT 1 — analysis + rubric score
    const analysis = finalizeAnalysis(await runPrompt(buildAnalysisPrompt(resume, jobDescription)));

    // PROMPT 2 and PROMPT 3 depend on the analysis, but not on each other -> run in parallel
    const [improvement, recs] = await Promise.all([
      runPrompt(buildImprovementPrompt(resume, jobDescription, analysis)),
      runPrompt(buildRecommendationPrompt(jobDescription, analysis)),
    ]);

    res.json({
      analysis,
      improvement: {
        improvedBullets: improvement.improvedBullets || [],
        missingInfoQuestions: improvement.missingInfoQuestions || [],
      },
      recommendations: (recs.recommendations || []).slice(0, 5),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
