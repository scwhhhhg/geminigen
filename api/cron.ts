import Groq from "groq-sdk";

export default async function handler(req, res) {
  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "user", content: "Buat 1 prompt foto wanita berhijab estetik" }
      ]
    });

    res.json({
      ok: true,
      prompt: completion.choices[0].message.content
    });
  } catch (err: any) {
    console.error("GROQ ERROR", err);
    res.status(500).json({ error: err.message });
  }
}
