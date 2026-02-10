import axios from "axios";
import FormData from "form-data";
import { generatePrompt } from "./prompt";

export default async function handler() {
  const prompt = await generatePrompt();

  const form = new FormData();
  form.append("prompt", prompt);
  form.append("model", "nano-banana-pro");
  form.append("aspect_ratio", "3:4");

  const r = await axios.post(
    "https://api.geminigen.ai/uapi/v1/generate_image",
    form,
    {
      headers: {
        "x-api-key": process.env.GEMINIGEN_API_KEY,
        ...form.getHeaders()
      }
    }
  );

  // simpan uuid + prompt ke DB / KV
}
