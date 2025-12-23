import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import cheerio from "cheerio";
import serverless from "serverless-http";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- Test endpoint ---
app.get("/api", (req, res) => {
  res.json({ status: "OK", message: "Zorgassist AI draait correct." });
});

// --- Triage flow ---
app.post("/api/triageflow", async (req, res) => {
  const { stap = 0, antwoord = "" } = req.body;

  // Simpele demo-flow
  const vragen = [
    "Heeft u een ongeluk gehad of bent u bewusteloos?",
    "Heeft u hoge koorts (>39°C) langer dan 3 dagen?",
    "Heeft u ernstige pijn of kortademigheid?",
  ];

  if (stap < vragen.length) {
    return res.json({ volgendeVraag: vragen[stap] });
  }

  let advies = "Neem contact op met uw huisarts.";
  let urgentie = "U3";
  let route = "huisarts";

  if (antwoord.toLowerCase().includes("ja") && stap === 0) {
    advies = "Bel direct 112.";
    urgentie = "U1";
    route = "spoedeisende hulp";
  } else if (antwoord.toLowerCase().includes("ja") && stap === 1) {
    advies = "Bel uw huisarts vandaag nog voor overleg over de koorts.";
    urgentie = "U2";
  } else if (antwoord.toLowerCase().includes("ja") && stap === 2) {
    advies = "Neem direct contact op met uw huisarts.";
    urgentie = "U2";
  }

  res.json({
    eindAdvies: `${advies}\nRoute: ${route}\nUrgentie: ${urgentie}`,
    bronnen: ["NHG", "NTS", "Thuisarts", "RIVM", "KNMG"],
  });
});

// --- Thuisarts scraper ---
app.get("/api/sources", async (req, res) => {
  try {
    const { zoekterm } = req.query;
    if (!zoekterm)
      return res.status(400).json({ error: "Geen zoekterm opgegeven." });

    const response = await fetch(
      `https://www.thuisarts.nl/zoeken?zoekterm=${encodeURIComponent(zoekterm)}`
    );
    const html = await response.text();
    const $ = cheerio.load(html);

    const resultaten = [];
    $(".search-result__title").each((i, el) => {
      const titel = $(el).text().trim();
      const link = "https://www.thuisarts.nl" + $(el).find("a").attr("href");
      resultaten.push({ titel, link });
    });

    res.json({ zoekterm, resultaten });
  } catch (err) {
    res.status(500).json({ error: "Kon bronnen niet ophalen." });
  }
});

// --- Export voor Vercel ---
export const handler = serverless(app);
