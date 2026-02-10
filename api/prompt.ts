import axios from "axios";

export async function generatePrompt() {
  const r = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a professional Instagram/Pinterest photographer prompt engineer"
        },
        {
          role: "user",
          content: `
          Buat 1 prompt photorealistic:
          Wanita berhijab usia 20an
          Pose estetik ala Instagram / Pinterest
          Natural light, candid, premium camera
          Jangan sebut kata AI
          `
        }
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`
      }
    }
  );

  return r.data.choices[0].message.content;
}
