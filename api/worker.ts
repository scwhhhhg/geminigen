import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getJobs, saveJobs } from "../lib/store";
import { uploadToR2 } from "../lib/r2";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const jobs = await getJobs();

    for (const job of jobs) {
      if (job.status !== "processing") continue;

      const statusRes = await fetch(
        `https://api.geminigen.ai/uapi/v1/job_status/${job.job_id}`,
        {
          headers: {
            "x-api-key": process.env.GEMINIGEN_API_KEY!,
          },
        }
      );

      const statusData = await statusRes.json();

      if (statusData.status === "completed") {
        const imgFetch = await fetch(statusData.image_url);
        const buffer = Buffer.from(await imgFetch.arrayBuffer());

        const filename = `images/${Date.now()}.jpg`;

        const r2Url = await uploadToR2(
          buffer,
          filename,
          "image/jpeg"
        );

        job.status = "done";
        job.r2_url = r2Url;
      }
    }

    await saveJobs(jobs);

    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
