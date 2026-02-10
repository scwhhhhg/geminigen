import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!
});

export async function generatePrompt() {
  const r = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "user",
        content:
          "Wanita berhijab usia 20an, pose estetik ala Instagram, photorealistic"
      }
    ]
  });

  return r.choices[0].message.content;
}
