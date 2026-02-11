import type { VercelRequest, VercelResponse } from "@vercel/node";
import Groq from "groq-sdk";
import { getJobs, saveJobs } from "../lib/store";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    if (req.method !== "POST") {
      return res.json({ alive: true });
    }

    // 1️⃣ Generate Prompt
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY!,
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content:
            "Buat 1 prompt foto wanita berhijab realistis ala Instagram, photorealistic, DSLR, soft lighting.",
        },
      ],
    });

    const prompt = completion.choices[0].message.content;

    // 2️⃣ Create GeminiGen Job
    const formData = new FormData();
    formData.append("prompt", prompt!);
    formData.append("model", "nano-banana-pro");

    const response = await fetch(
      "https://api.geminigen.ai/uapi/v1/generate_image",
      {
        method: "POST",
        headers: {
          "x-api-key": process.env.GEMINIGEN_API_KEY!,
        },
        body: formData,
      }
    );

    const result = await response.json();

    if (!result.job_id) {
      return res.status(500).json(result);
    }

    // 3️⃣ Save Job
    const jobs = await getJobs();
    jobs.push({
      job_id: result.job_id,
      prompt,
      status: "processing",
      created_at: Date.now(),
    });

    await saveJobs(jobs);

    return res.json({
      success: true,
      job_id: result.job_id,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
