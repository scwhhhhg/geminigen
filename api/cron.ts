import type { VercelRequest, VercelResponse } from "@vercel/node";
import Groq from "groq-sdk";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // 1️⃣ Generate prompt dari Groq
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY!
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: `
Buat 1 prompt foto realistis wanita berhijab estetik ala Instagram / Pinterest.
Detailkan pose, lighting, kamera profesional, depth of field, dan suasana.
Jawab hanya 1 paragraf prompt tanpa penjelasan tambahan.
          `
        }
      ]
    });

    const prompt = completion.choices[0].message.content;

    // 2️⃣ Kirim ke GeminiGen
    const formData = new FormData();
    formData.append("prompt", prompt!);
    formData.append("model", "nano-banana-pro");

    const response = await fetch(
  "https://api.geminigen.ai/uapi/v1/generate_image",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.GEMINIGEN_API_KEY!
    },
    body: JSON.stringify({
      prompt: prompt,
      model: "nano-banana-pro"
    })
  }
);

    const result = await response.json();

    return res.status(200).json({
      success: true,
      prompt,
      geminigen: result
    });
  } catch (err: any) {
    console.error("CRON ERROR:", err);
    return res.status(500).json({
      error: err.message
    });
  }
}
