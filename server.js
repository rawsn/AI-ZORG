import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import fetch from "node-fetch";
import cheerio from "cheerio";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- EXPRESS APP ---
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// --- API ROUTES ---

// 1️⃣ Basis test-endpoint
app.get("/api", (req, res) => {
  res.json({
    status: "OK",
    message: "Zorgassist AI API is actief.",
  });
});

// 2️⃣ Triage – analyse van klacht (simpele AI placeholder)
app.post("/api/triage", async (req, res) => {
  try {
    const { klacht, postcode } = req.body;

    if (!klacht) {
      return res.status(400).json({ error: "Geen klacht opgegeven." });
    }

    // Simpele beslisboom
    let advies = "";
    let route = "";
    let urgentie = "";

    if (
      klacht.toLowerCase().includes("ongeluk") ||
      klacht.toLowerCase().includes("bewusteloos") ||
      klacht.toLowerCase().includes("bloed")
    ) {
      advies = "Bel direct 112";
      route = "spoedeisende hulp";
      urgentie = "U1";
    } else if (klacht.toLowerCase().includes("koorts")) {
      advies = "Neem contact op met uw huisarts als de koorts langer dan 3 dagen aanhoudt of u zich erg ziek voelt.";
      route = "huisarts";
      urgentie = "U3";
    } else if (klacht.toLowerCase().includes("keelpijn")) {
      advies = "U kunt meestal zelf zorgen, zie Thuisarts.nl > Keelpijn.";
      route = "zelfzorg";
      urgentie = "U5";
    } else {
      advies = "Neem contact op met uw huisarts voor overleg.";
      route = "huisarts";
      urgentie = "U3";
    }

    res.json({
      advies,
      route,
      urgentie,
      bron: [
        "NHG",
        "NTS",
        "Thuisarts.nl",
        "RIVM",
        "KNMG",
        "Federatie Medische Specialisten",
      ],
      juridisch: {
        disclaimer:
          "Zorgassist AI biedt alleen zorgnavigatie en geen medische adviezen.",
        bron: "KNMG-richtlijn beslisondersteunende systemen (2024)",
      },
    });
  } catch (error) {
    console.error("Fout in /api/triage:", error);
    res.status(500).json({ error: "Serverfout in triage." });
  }
});

// 3️⃣ Dynamische vraagstroom (triageflow)
app.post("/api/triageflow", (req, res) => {
  try {
    const { stap, antwoord } = req.body;
    let volgendeVraag = "";
    let eindAdvies = null;

    switch (stap) {
      case 0:
        volgendeVraag = "Heeft u pijn op de borst?";
        break;
      case 1:
        if (antwoord.toLowerCase().includes("ja")) {
          eindAdvies = "Bel direct 112 (denk aan hartklachten)";
        } else {
          volgendeVraag = "Heeft u hoge koorts of benauwdheid?";
        }
        break;
      case 2:
        if (antwoord.toLowerCase().includes("ja")) {
          eindAdvies =
            "Neem direct contact op met uw huisarts of huisartsenpost.";
        } else {
          eindAdvies = "Blijf uw klachten monitoren of bezoek Thuisarts.nl.";
        }
        break;
      default:
        eindAdvies = "Einde triage.";
    }

    res.json({ stap, volgendeVraag, eindAdvies });
  } catch (err) {
    console.error("Fout in /api/triageflow:", err);
    res.status(500).json({ error: "Triagelogica mislukt." });
  }
});

// 4️⃣ Bronnen ophalen van Thuisarts.nl
app.get("/api/sources", async (req, res) => {
  try {
    const { zoekterm } = req.query;
    if (!zoekterm) return res.status(400).json({ error: "Geen zoekterm." });

    const url = `https://www.thuisarts.nl/zoeken?zoekterm=${encodeURIComponent(
      zoekterm
    )}`;
    const response = await fetch(url);
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
    console.error("Fout bij /api/sources:", err);
    res.status(500).json({ error: "Fout bij ophalen bronnen." });
  }
});

// 5️⃣ Fallback: index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// --- SERVER START ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Zorgassist AI actief op poort ${PORT}`));
