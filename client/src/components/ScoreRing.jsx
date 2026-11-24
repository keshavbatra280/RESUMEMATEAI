export default function ScoreRing({ score }) {
  const r = 70, c = 2 * Math.PI * r;
  const color = score >= 75 ? "#16A34A" : score >= 50 ? "#EA8A0C" : "#DC2626";
  return (
    <div className="relative h-48 w-48">
      <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90" role="img" aria-label={`Match score ${score} out of 100`}>
        <circle cx="90" cy="90" r={r} fill="none" stroke="#E5E8EC" strokeWidth="14" />
        <circle cx="90" cy="90" r={r} fill="none" stroke={color} strokeWidth="14" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-5xl font-extrabold">{score}</span>
        <span className="text-sm text-ink/55">out of 100</span>
      </div>
    </div>
  );
}
