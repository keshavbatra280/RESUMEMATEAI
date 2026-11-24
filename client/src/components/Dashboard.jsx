import ScoreRing from "./ScoreRing.jsx";

const TONE = {
  green: "bg-green-50 text-green-800 border-green-300",
  orange: "bg-orange-50 text-orange-800 border-orange-300",
  red: "bg-red-50 text-red-800 border-red-300",
};

function Chip({ tone, label, hint }) {
  return (
    <li title={hint || ""} className={`rounded-full border px-3 py-1 text-sm font-medium ${TONE[tone]}`}>
      {label}
    </li>
  );
}

function List({ items, empty }) {
  if (!items?.length) return <p className="text-sm text-ink/55">{empty}</p>;
  return <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">{items.map((t, i) => <li key={i}>{t}</li>)}</ul>;
}

function Card({ title, children, className = "" }) {
  return (
    <section className={`card ${className}`}>
      <h3 className="mb-3 text-xl font-bold">{title}</h3>
      {children}
    </section>
  );
}

export default function Dashboard({ result, onReset }) {
  const { analysis: a, improvement, recommendations } = result;
  const verdict = a.score >= 75 ? "Strong match" : a.score >= 50 ? "Partial match" : "Needs work";
  const sorted = [...(a.missingSkills || [])].sort((x, y) => ["high", "medium", "low"].indexOf(x.importance) - ["high", "medium", "low"].indexOf(y.importance));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-3xl font-extrabold">Results{a.jobTitle ? `: ${a.jobTitle}` : ""}</h2>
        <button onClick={onReset} className="btn-primary">Analyze Another Resume</button>
      </div>

      <Card title="Overall match score">
        <div className="grid items-center gap-6 md:grid-cols-[12rem_1fr]">
          <div className="mx-auto"><ScoreRing score={a.score} /></div>
          <div>
            <p className="font-display text-2xl font-bold">{verdict}</p>
            <p className="mt-1 text-ink/75">{a.summary}</p>
            <h4 className="mb-2 mt-5 font-semibold">How this score was calculated</h4>
            <ul className="space-y-3">
              {a.rubric.map((r) => (
                <li key={r.key}>
                  <div className="flex justify-between text-sm font-semibold"><span>{r.category}</span><span>{r.score}/{r.max}</span></div>
                  <div className="mt-1 h-2 rounded-full bg-ink/10"><div className="h-2 rounded-full bg-brand" style={{ width: `${(r.score / r.max) * 100}%` }} /></div>
                  <p className="mt-1 text-xs text-ink/65">{r.reason}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-ink/55">The five parts add up to 100. This compares the two documents; it is not a prediction of whether you will be hired.</p>
          </div>
        </div>
      </Card>

      <Card title="Skills comparison">
        <div className="grid gap-6 md:grid-cols-3">
          <div><h4 className="mb-2 font-semibold text-green-700">Matching ({a.matchingSkills.length})</h4>
            <ul className="flex flex-wrap gap-2">{a.matchingSkills.map((s, i) => <Chip key={i} tone="green" label={s.skill} hint={s.evidence} />)}</ul></div>
          <div><h4 className="mb-2 font-semibold text-orange-700">Partial ({a.partialSkills.length})</h4>
            <ul className="flex flex-wrap gap-2">{a.partialSkills.map((s, i) => <Chip key={i} tone="orange" label={s.skill} hint={s.note} />)}</ul></div>
          <div><h4 className="mb-2 font-semibold text-red-700">Missing ({sorted.length})</h4>
            <ul className="flex flex-wrap gap-2">{sorted.map((s, i) => <Chip key={i} tone="red" label={`${s.skill}${s.importance === "high" ? " (key)" : ""}`} hint={`Importance: ${s.importance}`} />)}</ul></div>
        </div>
        <p className="mt-4 text-xs text-ink/55">Hover over a skill to see the evidence or reason.</p>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Strengths"><List items={a.strengths} empty="No clear strengths found." /></Card>
        <Card title="Areas to improve">
          <List items={[...a.weaknesses, ...a.experienceGaps]} empty="No major gaps found." />
        </Card>
      </div>

      <Card title="Prioritized recommendations">
        <ol className="space-y-4">
          {recommendations.map((r, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand font-bold text-white">{r.priority ?? i + 1}</span>
              <div>
                <p className="font-semibold">{r.title}</p>
                <p className="text-sm leading-relaxed">{r.action}</p>
                <p className="mt-1 text-xs text-ink/60">Why: {r.reason}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <Card title="Improved resume bullet points">
        <p className="mb-4 text-sm text-ink/65">Rewrites keep your original facts. Nothing new has been added. Please check each one is accurate before using it.</p>
        <div className="space-y-5">
          {improvement.improvedBullets.map((b, i) => (
            <div key={i} className="rounded-lg border border-ink/10 p-4">
              <p className="text-sm text-ink/60"><span className="font-semibold text-ink">Original:</span> {b.original}</p>
              <p className="mt-2 rounded-md bg-green-50 p-3 text-sm"><span className="font-semibold">Improved:</span> {b.improved}</p>
              <p className="mt-2 text-xs text-ink/60">{b.why}</p>
              {b.questionsForUser?.length > 0 && (
                <ul className="mt-2 list-disc pl-5 text-xs text-orange-800">
                  {b.questionsForUser.map((q, j) => <li key={j}>{q}</li>)}
                </ul>
              )}
              <button className="btn-ghost mt-3" onClick={() => navigator.clipboard?.writeText(b.improved)}>Copy improved text</button>
            </div>
          ))}
        </div>
        {improvement.missingInfoQuestions.length > 0 && (
          <div className="mt-5 rounded-lg bg-orange-50 p-4">
            <h4 className="font-semibold">Details that would make your resume stronger</h4>
            <ul className="mt-2 list-disc pl-5 text-sm">{improvement.missingInfoQuestions.map((q, i) => <li key={i}>{q}</li>)}</ul>
          </div>
        )}
      </Card>

      <div className="flex justify-center pt-2"><button onClick={onReset} className="btn-primary">Analyze Another Resume</button></div>
    </div>
  );
}
