import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "./r2";

const KEY = "jobs.json";

export async function getJobs(): Promise<any[]> {
  try {
    const data = await r2.send(
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: KEY,
      })
    );

    const body = await data.Body?.transformToString();
    return body ? JSON.parse(body) : [];
  } catch {
    return [];
  }
}

export async function saveJobs(jobs: any[]) {
  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: KEY,
      Body: JSON.stringify(jobs),
      ContentType: "application/json",
    })
  );
}
