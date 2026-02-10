export default async function handler(req, res) {
  const { uuid, status } = req.body;

  if (status === 1) {
    // SIMPAN ke DB / KV / JSON
    // status: READY_FOR_DOWNLOAD
  }

  res.status(200).json({ ok: true });
}
