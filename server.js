require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

//  Middleware 
app.use(express.json());
app.use(express.static("public"));

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

//  1) WEATHER API 
// GET /api/weather?city=Almaty
app.get("/api/weather", async (req, res) => {
  try {
    const city = (req.query.city || "").trim();
    if (!city) {
      return res.status(400).json({ error: "City is required. Example: /api/weather?city=Almaty" });
    }

    const apiKey = getRequiredEnv("OPENWEATHER_API_KEY");

    const url =
      `https://api.openweathermap.org/data/2.5/weather` +
      `?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=en`;

    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ error: "Failed to fetch weather", details: text });
    }

    const data = await response.json();

    const result = {
      city: data.name,
      countryCode: data.sys?.country || "",
      coordinates: {
        lat: data.coord?.lat,
        lon: data.coord?.lon,
      },
      temperature: data.main?.temp,
      feelsLike: data.main?.feels_like,
      description: data.weather?.[0]?.description || "",
      windSpeed: data.wind?.speed,
      rainLast3h: data.rain?.["3h"] || 0,
    };

    res.json(result);
  } catch (err) {
    console.error("Weather error:", err);
    res.status(500).json({ error: "Failed to fetch weather", details: err.message });
  }
});

//  2) NEWS API 
// GET /api/news?city=Almaty
app.get("/api/news", async (req, res) => {
  try {
    const city = (req.query.city || "").trim();
    if (!city) {
      return res.status(400).json({ error: "City is required. Example: /api/news?city=Almaty" });
    }

    const apiKey = getRequiredEnv("NEWS_API_KEY");

    const url =
      `https://newsapi.org/v2/everything` +
      `?q=${encodeURIComponent(city)}&pageSize=5&sortBy=publishedAt&language=en`;

    const response = await fetch(url, {
      headers: { "X-Api-Key": apiKey },
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ error: "Failed to fetch news", details: text });
    }

    const data = await response.json();

    const articles = (data.articles || []).map((a) => ({
      title: a.title,
      description: a.description,
      url: a.url,
      source: a.source?.name,
      publishedAt: a.publishedAt,
    }));

    res.json({ city, total: articles.length, articles });
  } catch (err) {
    console.error("News error:", err);
    res.status(500).json({ error: "Failed to fetch news", details: err.message });
  }
});

//  3) COUNTRY API (Restcountries) 
// GET /api/country?name=Kazakhstan
app.get("/api/country", async (req, res) => {
  try {
    const name = (req.query.name || "").trim();
    if (!name) {
      return res.status(400).json({ error: "Country name is required. Example: /api/country?name=Kazakhstan" });
    }

    const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fullText=false`;

    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ error: "Failed to fetch country", details: text });
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(404).json({ error: "Country not found" });
    }

    const c = data[0];

    const result = {
      name: c.name?.common,
      officialName: c.name?.official,
      region: c.region,
      subregion: c.subregion,
      capital: c.capital?.[0],
      population: c.population,
      area: c.area,
      currencies: c.currencies ? Object.keys(c.currencies) : [],
      languages: c.languages ? Object.values(c.languages) : [],
      flag: c.flag,
      cca2: c.cca2,
      cca3: c.cca3,
    };

    res.json(result);
  } catch (err) {
    console.error("Country error:", err);
    res.status(500).json({ error: "Failed to fetch country", details: err.message });
  }
});

//  START SERVER 
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});