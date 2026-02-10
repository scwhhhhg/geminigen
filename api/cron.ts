import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    ok: true,
    method: req.method,
    env: {
      hasGroq: !!process.env.GROQ_API_KEY,
      hasGeminigen: !!process.env.GEMINIGEN_API_KEY
    }
  });
}
