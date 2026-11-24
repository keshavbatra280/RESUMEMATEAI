import { useState } from "react";
import Home from "./components/Home.jsx";
import Analyzer from "./components/Analyzer.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Loader from "./components/Loader.jsx";
import { analyzeResume } from "./api.js";

export default function App() {
  const [view, setView] = useState("home"); // home | input | loading | results
  const [inputs, setInputs] = useState({ resume: "", jobDescription: "" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function handleAnalyze(resume, jobDescription) {
    setInputs({ resume, jobDescription });
    setError("");
    setView("loading");
    try {
      setResult(await analyzeResume(resume, jobDescription));
      setView("results");
    } catch (e) {
      setError(e.message);
      setView("input");
    }
  }

  function reset() {
    setInputs({ resume: "", jobDescription: "" });
    setResult(null);
    setError("");
    setView("input");
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <button onClick={() => setView("home")} className="flex items-center gap-2 font-display text-xl font-extrabold">
            <img src="/favicon.svg" alt="" className="h-7 w-7" /> ResumeMate AI
          </button>
          {view !== "input" && view !== "loading" && (
            <button onClick={() => setView("input")} className="btn-ghost">Analyze My Resume</button>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {view === "home" && <Home onStart={() => setView("input")} />}
        {view === "input" && <Analyzer initial={inputs} error={error} onSubmit={handleAnalyze} />}
        {view === "loading" && <Loader />}
        {view === "results" && <Dashboard result={result} onReset={reset} />}
      </main>
      <footer className="px-4 pb-8 text-center text-xs text-ink/50">
        ResumeMate AI is a guidance tool. The match score compares documents; it does not predict hiring outcomes.
      </footer>
    </div>
  );
}
