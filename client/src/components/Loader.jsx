import { useEffect, useState } from "react";

const STEPS = ["Reading your resume and the job description", "Scoring each part of the rubric", "Rewriting weak bullet points", "Preparing your recommendations"];

export default function Loader() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => Math.min(n + 1, STEPS.length - 1)), 4500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="mx-auto max-w-md py-20 text-center" role="status" aria-live="polite">
      <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-brand-soft border-t-brand" />
      <p className="mt-6 font-display text-xl font-semibold">Analyzing your resume…</p>
      <p className="mt-2 text-ink/65">{STEPS[i]}</p>
      <p className="mt-1 text-xs text-ink/45">This usually takes 15–30 seconds.</p>
    </div>
  );
}
