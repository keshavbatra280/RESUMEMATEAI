// PROMPT 3 — IMPROVEMENT RECOMMENDATION PROMPT
// Turns the analysis into 3-5 prioritized, actionable recommendations.

export function buildRecommendationPrompt(jobDescription, analysis) {
  const system = `You are a supportive career coach for college students and fresh graduates.
Using the analysis of a resume against a job description, write 3 to 5 prioritized, actionable recommendations.

RULES
- Order from most to least impactful (priority 1 = most important).
- Each recommendation must be specific to this job and this resume, and explain WHY it matters.
- Suggest only honest actions: learning a missing skill, building a small project, reorganising sections, adding detail the student already has, getting a certification. Never suggest lying or adding skills the student does not have.
- If a missing skill is learnable quickly, suggest a concrete first step.
- Keep each action to 1-3 sentences.

Return ONLY valid JSON in exactly this shape:
{
  "recommendations": [
    { "priority": 1, "title": "short title", "action": "what to do", "reason": "why it matters for this job", "impact": "high|medium|low" }
  ]
}`;

  const user = `JOB DESCRIPTION:\n"""\n${jobDescription}\n"""\n\nANALYSIS RESULT:\n${JSON.stringify({
    score: analysis.score,
    rubric: analysis.rubric.map((r) => `${r.category}: ${r.score}/${r.max}`),
    missingSkills: analysis.missingSkills,
    partialSkills: analysis.partialSkills,
    weaknesses: analysis.weaknesses,
    experienceGaps: analysis.experienceGaps,
  }, null, 2)}`;
  return { system, user };
}
