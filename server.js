require('dotenv').config();
const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
const app = express();
const PORT = process.env.PORT || 3000;
const RAPID_KEY = process.env.RAPIDAPI_KEY;

if (!RAPID_KEY) {
  console.error("Please set RAPIDAPI_KEY in .env");
  process.exit(1);
}

app.use(express.json());

// Proxy POST: receive { url } in body and forward it with RapidAPI headers
app.post('/api', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "No url provided" });

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "anime-db.p.rapidapi.com",
        "x-rapidapi-key": RAPID_KEY
      }
    });
    const text = await response.text();
    // forward status and body
    res.status(response.status).send(text);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Proxy fetch error" });
  }
});

app.listen(PORT, () => console.log(`Proxy running on http://localhost:${PORT}`))