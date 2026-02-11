import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const r = await axios.get("https://httpbin.org/get");

    res.json({
      ok: true,
      axios: true,
      status: r.status
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
