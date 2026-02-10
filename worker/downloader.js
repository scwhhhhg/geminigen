const { chromium } = require("playwright");
const axios = require("axios");
const fs = require("fs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_KEY,
    secretAccessKey: process.env.R2_SECRET
  }
});

async function uploadToR2(buffer, name) {
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: name,
      Body: buffer,
      ContentType: "image/jpeg"
    })
  );

  return `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET}/${name}`;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // login
  await page.goto("https://geminigen.ai/login");
  await page.fill('input[type="email"]', process.env.GEM_EMAIL);
  await page.fill('input[type="password"]', process.env.GEM_PASS);
  await page.click("button[type=submit]");
  await page.waitForURL("**/dashboard**");

  // images
  await page.goto("https://geminigen.ai/dashboard/images");
  await page.waitForTimeout(3000);

  const images = await page.$$eval("img", imgs =>
    imgs.map(i => i.src).filter(Boolean)
  );

  for (const src of images) {
    if (!src.includes("cloudinary")) continue;

    const img = await axios.get(src, { responseType: "arraybuffer" });
    const name = `nano-banana/${Date.now()}.jpg`;

    const url = await uploadToR2(img.data, name);

    console.log("Uploaded:", url);

    // OPTIONAL: POST balik ke Vercel API
    await axios.post("https://your-vercel.app/api/image-done", {
      url
    });
  }

  await browser.close();
})();
