import { useRef, useState } from "react";
import { extractFile } from "../api.js";
import { SAMPLE_RESUME, SAMPLE_JOB, JOB_PLACEHOLDER } from "../sampleData.js";

export default function Analyzer({ initial, error, onSubmit }) {
  const [resume, setResume] = useState(initial.resume);
  const [job, setJob] = useState(initial.jobDescription);
  const [errors, setErrors] = useState({});
  const [fileMsg, setFileMsg] = useState("");
  const [reading, setReading] = useState(false);
  const fileRef = useRef(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileMsg("");
    setReading(true);
    try {
      const { text } = await extractFile(file);
      setResume(text);
      setErrors((x) => ({ ...x, resume: "" }));
      setFileMsg(`Loaded text from ${file.name}. Check it below before analyzing.`);
    } catch (err) {
      setFileMsg(err.message);
    } finally {
      setReading(false);
      e.target.value = "";
    }
  }

  function submit(e) {
    e.preventDefault();
    const next = {};
    if (!resume.trim()) next.resume = "Add your resume text or upload a PDF/TXT file.";
    else if (resume.trim().length < 50) next.resume = "This looks too short. Add more of your resume.";
    if (!job.trim()) next.job = "Paste the job or internship description.";
    setErrors(next);
    if (Object.keys(next).length === 0) onSubmit(resume.trim(), job.trim());
  }

  const area = (bad) =>
    `mt-2 h-80 w-full resize-y rounded-lg border bg-white p-3 text-sm leading-relaxed focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 ${bad ? "border-red-500" : "border-ink/20"}`;

  return (
    <form onSubmit={submit} noValidate>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-3xl font-extrabold">Compare your resume with a job</h2>
          <p className="mt-1 text-ink/65">Paste both texts below. Your resume is sent to the AI only to produce this analysis.</p>
        </div>
        <button type="button" className="btn-ghost" onClick={() => { setResume(SAMPLE_RESUME); setJob(SAMPLE_JOB); setErrors({}); }}>
          Load sample data
        </button>
      </div>

      {error && <div role="alert" className="mb-5 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800"><b>Analysis failed.</b> {error}</div>}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="resume" className="font-display text-lg font-semibold">Your resume</label>
            <button type="button" className="btn-ghost" disabled={reading} onClick={() => fileRef.current?.click()}>
              {reading ? "Reading file…" : "Upload PDF or TXT"}
            </button>
            <input ref={fileRef} type="file" accept=".pdf,.txt,application/pdf,text/plain" className="hidden" onChange={handleFile} />
          </div>
          <textarea id="resume" className={area(errors.resume)} value={resume} onChange={(e) => setResume(e.target.value)} placeholder="Paste your resume text here…" />
          {fileMsg && <p className="mt-1 text-xs text-ink/65">{fileMsg}</p>}
          {errors.resume && <p role="alert" className="mt-1 text-sm text-red-600">{errors.resume}</p>}
        </div>
        <div>
          <div className="flex h-[42px] items-center"><label htmlFor="job" className="font-display text-lg font-semibold">Job or internship description</label></div>
          <textarea id="job" className={area(errors.job)} value={job} onChange={(e) => setJob(e.target.value)} placeholder={JOB_PLACEHOLDER} />
          {errors.job && <p role="alert" className="mt-1 text-sm text-red-600">{errors.job}</p>}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button type="submit" className="btn-primary w-full sm:w-auto">Analyze Resume</button>
      </div>
    </form>
  );
}
