import OpenAI from "openai";

let client;
function getClient() {
  if (!process.env.OPENAI_API_KEY) {
    const e = new Error("The server has no OpenAI API key. Add OPENAI_API_KEY to the .env file and restart the server.");
    e.status = 500;
    throw e;
  }
  client ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return client;
}

/** Sends one prompt template to GPT-4o and returns the parsed JSON object. */
export async function runPrompt({ system, user }) {
  try {
    const res = await getClient().chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o",
      temperature: 0.2, // low temperature = more consistent scoring
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });
    return JSON.parse(res.choices[0].message.content);
  } catch (err) {
    if (err instanceof SyntaxError) {
      const e = new Error("The AI returned an unreadable response. Please try again.");
      e.status = 502;
      throw e;
    }
    if (err.status === 401) err.message = "OpenAI rejected the API key. Check OPENAI_API_KEY in your .env file.";
    else if (err.status === 429) err.message = "OpenAI rate limit or quota reached. Check your billing/usage and try again shortly.";
    throw err;
  }
}
