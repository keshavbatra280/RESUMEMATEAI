// PROMPT 1 — RESUME ANALYSIS PROMPT
// Compares resume vs. job description and scores it with a fixed rubric.

export const RUBRIC = [
  { key: "requiredSkills", category: "Required skills match", max: 40 },
  { key: "experience", category: "Experience & project relevance", max: 25 },
  { key: "keywords", category: "Keyword & terminology alignment", max: 15 },
  { key: "education", category: "Education & certifications fit", max: 10 },
  { key: "presentation", category: "Resume clarity & impact", max: 10 },
];

export function buildAnalysisPrompt(resume, jobDescription) {
  const system = `You are an experienced technical recruiter and career coach reviewing resumes of college students and fresh graduates.
You compare a RESUME with a JOB DESCRIPTION and produce an objective, explainable analysis.

STRICT RULES
- Base every statement ONLY on text that appears in the resume or job description. Never invent or assume skills, experience, certifications or numbers.
- A skill counts as "matching" only if the resume clearly shows it. Use "partial" when it is only implied, listed without any evidence, or a closely related skill is shown. Use "missing" when there is no evidence.
- Treat this as a document comparison, NOT a prediction of hiring success.
- Be fair to students: projects, coursework, internships and extracurriculars count as experience.

SCORING RUBRIC (total 100). Score each category as an integer from 0 to its maximum:
${RUBRIC.map((r) => `- ${r.key} (${r.category}): 0-${r.max}`).join("\n")}
Guidance: requiredSkills = share of the job's required skills clearly shown (partial skills count about half). experience = how relevant the projects/jobs/internships are to the role's responsibilities. keywords = overlap of important tools and terminology. education = degree/field/certification fit. presentation = clarity, structure and use of concrete results in the resume.
Give a one-sentence reason for every category score, quoting or pointing to specific evidence.

Return ONLY valid JSON in exactly this shape:
{
  "jobTitle": "string, role title inferred from the job description",
  "summary": "2-3 sentence neutral summary of the fit",
  "rubric": [ { "key": "requiredSkills|experience|keywords|education|presentation", "score": 0, "reason": "string" } ],
  "matchingSkills": [ { "skill": "string", "evidence": "where it appears in the resume" } ],
  "partialSkills": [ { "skill": "string", "note": "why it is only partial" } ],
  "missingSkills": [ { "skill": "string", "importance": "high|medium|low" } ],
  "strengths": [ "string - relevant experience / project strengths" ],
  "weaknesses": [ "string - areas needing improvement" ],
  "experienceGaps": [ "string - gaps between the role's experience expectations and the resume" ]
}`;

  const user = `JOB DESCRIPTION:\n"""\n${jobDescription}\n"""\n\nRESUME:\n"""\n${resume}\n"""`;
  return { system, user };
}

/** Server-side scoring: totals the rubric ourselves so the score is always consistent and explainable. */
export function finalizeAnalysis(raw) {
  const rubric = RUBRIC.map((r) => {
    const found = (raw.rubric || []).find((x) => x.key === r.key) || {};
    const score = Math.max(0, Math.min(r.max, Math.round(Number(found.score) || 0)));
    return { ...r, score, reason: found.reason || "No explanation provided." };
  });
  return {
    ...raw,
    matchingSkills: raw.matchingSkills || [],
    partialSkills: raw.partialSkills || [],
    missingSkills: raw.missingSkills || [],
    strengths: raw.strengths || [],
    weaknesses: raw.weaknesses || [],
    experienceGaps: raw.experienceGaps || [],
    rubric,
    score: rubric.reduce((sum, r) => sum + r.score, 0),
  };
}
