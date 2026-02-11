import type { VercelRequest, VercelResponse } from "@vercel/node";
import Groq from "groq-sdk";
import { uploadToR2 } from "../lib/r2";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(200).json({ alive: true });
    }

    // =============================
    // 1️⃣ Generate Prompt (Groq)
    // =============================
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY!,
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: `
Buat 1 prompt foto wanita berhijab realistis ala Instagram/Pinterest.
Detailkan pose estetik, lighting natural, kamera profesional,
depth of field, suasana hangat, photorealistic.
Jawab hanya 1 paragraf.
          `,
        },
      ],
    });

    const prompt = completion.choices[0].message.content;

    // =============================
    // 2️⃣ Generate Image (GeminiGen)
    // =============================
    const formData = new FormData();
    formData.append("prompt", prompt!);
    formData.append("model", "nano-banana-pro");
    formData.append("aspect_ratio", "4:5");
    formData.append("style", "Photorealistic");

    const imageResponse = await fetch(
      "https://api.geminigen.ai/uapi/v1/generate_image",
      {
        method: "POST",
        headers: {
          "x-api-key": process.env.GEMINIGEN_API_KEY!,
        },
        body: formData,
      }
    );

    const imageResult = await imageResponse.json();

    if (!imageResult.image_url_
