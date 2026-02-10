import axios from "axios";

export default async function handler(req, res) {
  const { uuid, id, status } = req.body;

  if (status === "completed") {
    // MODE A: coba history API
    try {
      const h = await axios.get(
        `https://api.geminigen.ai/uapi/v1/history/${id}`,
        {
          headers: {
            "x-api-key": process.env.GEMINIGEN_API_KEY,
          },
        }
      );

      // kalau ada image_url → simpan
      // kalau tidak → mark as READY_MANUAL
    } catch (e) {
      // fallback
    }
  }

  res.status(200).send("ok");
}
