const BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

async function request(path, options) {
  let res;
  try {
    res = await fetch(`${BASE}/api${path}`, options);
  } catch {
    throw new Error("Cannot reach the server. Make sure the backend is running (npm start in /server).");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status}).`);
  return data;
}

export const analyzeResume = (resume, jobDescription) =>
  request("/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume, jobDescription }),
  });

export const extractFile = (file) => {
  const form = new FormData();
  form.append("file", file);
  return request("/extract", { method: "POST", body: form });
};
