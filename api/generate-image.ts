import axios from "axios";
import FormData from "form-data";

export default async function handler(req, res) {
  const form = new FormData();
  form.append("prompt", "test image");
  form.append("model", "nano-banana-pro");

  const r = await axios.post(
    "https://api.geminigen.ai/uapi/v1/generate_image",
    form,
    {
      headers: {
        "x-api-key": process.env.GEMINIGEN_API_KEY!,
        ...form.getHeaders()
      }
    }
  );

  res.json(r.data);
}
