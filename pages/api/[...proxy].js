export default async function handler(req, res) {
  const path = req.query.proxy.join("/"); // pega o que vem depois de /api/
  const url = `http://201.131.245.6:6574/${path}`;

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        ...req.headers, // repassa os headers
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.text();

    res.status(response.status).send(data);
  } catch (error) {
    res.status(500).json({ error: "Erro no proxy", details: error.message });
  }
}
