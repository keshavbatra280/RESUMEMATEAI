const ROWS = [
  ["Required skills match", 31, 40],
  ["Experience & projects", 16, 25],
  ["Keywords", 9, 15],
  ["Education", 8, 10],
  ["Clarity & impact", 6, 10],
];

export default function Home({ onStart }) {
  return (
    <section className="grid items-center gap-10 lg:grid-cols-2">
      <div>
        <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">Make Your Resume Job-Ready</h1>
        <p className="mt-5 max-w-xl text-lg text-ink/75">
          Paste your resume and a job or internship description. ResumeMate AI shows which skills you already prove, which are missing, and
          exactly how the match score was worked out. It then rewrites weak bullet points without inventing anything.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button onClick={onStart} className="btn-primary text-lg">Analyze My Resume</button>
          <span className="text-sm text-ink/60">Free. No sign-up.</span>
        </div>
      </div>

      <div className="card" aria-label="Example score breakdown">
        <div className="mb-4 flex items-end justify-between">
          <p className="font-display text-lg font-semibold">Sample score breakdown</p>
          <p className="font-display text-4xl font-extrabold text-brand">70<span className="text-lg text-ink/50">/100</span></p>
        </div>
        <ul className="space-y-3">
          {ROWS.map(([label, s, m]) => (
            <li key={label}>
              <div className="mb-1 flex justify-between text-sm"><span>{label}</span><span className="font-semibold">{s}/{m}</span></div>
              <div className="h-2 rounded-full bg-ink/10"><div className="h-2 rounded-full bg-brand" style={{ width: `${(s / m) * 100}%` }} /></div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-ink/55">Every point comes from a fixed five-part rubric, with a reason given for each part.</p>
      </div>
    </section>
  );
}
