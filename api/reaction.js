export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method tidak diizinkan." });
  }

  try {
    const { url, reaction } = req.body || {};

    if (!url || !reaction) {
      return res.status(400).json({
        message: "Parameter url dan reaction wajib diisi."
      });
    }

    const apiKey = process.env.NEXA_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        message: "NEXA_API_KEY belum dikonfigurasi di Vercel."
      });
    }

    const endpoint = new URL("https://api.nexadev.my.id/api/rch");
    endpoint.searchParams.set("key", apiKey);
    endpoint.searchParams.set("url", url);
    endpoint.searchParams.set("reaction", reaction);

    const apiResponse = await fetch(endpoint.toString(), {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });

    const contentType = apiResponse.headers.get("content-type") || "";
    const raw = await apiResponse.text();

    let data;
    try {
      data = contentType.includes("application/json") ? JSON.parse(raw) : { message: raw };
    } catch {
      data = { message: raw };
    }

    if (!apiResponse.ok) {
      return res.status(apiResponse.status).json({
        message: data.message || data.error || "API reaction menolak request."
      });
    }

    return res.status(200).json({
      message: data.message || "Request reaction berhasil dikirim.",
      data
    });
  } catch (error) {
    console.error("Reaction API error:", error);
    return res.status(500).json({
      message: "Gagal menghubungi API reaction.",
      error: error.message
    });
  }
}
