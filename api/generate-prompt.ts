import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generatePrompt() {
  const res = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content:
          "You generate ultra-photorealistic Instagram/Pinterest style prompts"
      },
      {
        role: "user",
        content: `
Create ONE photorealistic prompt:
- Indonesian woman, hijab
- age mid 20s
- aesthetic pose
- Instagram / Pinterest vibe
- natural lighting
- fashion editorial
- camera details
Return only the prompt text.
`
      }
    ]
  });

  return res.choices[0].message.content!;
}
