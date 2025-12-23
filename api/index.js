// api/index.js — Zorgassist AI Backend
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Startvragen (dummy triageflow als voorbeeld)
const vragen = [
  "Heeft u een ongeval gehad of bent u bewusteloos?",
  "Heeft u hevige pijn of veel bloedverlies?",
  "Heeft u koorts boven de 39 graden of kortademigheid?",
];

const adviezen = {
  U1: "Bel direct 112. Route: spoedeisende hulp.",
  U3: "Neem contact op met uw huisarts. Route: huisarts.",
  U5: "U kunt zelfzorg toepassen. Raadpleeg Thuisarts.nl voor advies.",
};

// API root check
app.get("/", (req, res) => {
  res.json({ status: "Zorgassist AI API actief" });
});

// Dynamische triageflow
app.post("/api/triageflow", (req, res) => {
  const { stap, antwoord } = req.body;

  // Eerste stap
  if (!stap || stap === 0) {
    return res.json({ volgendeVraag: vragen[0] });
  }

  // Beslissingsboom
  if (stap === 1 && antwoord === "Ja") {
    return res.json({ eindAdvies: adviezen.U1 });
  }

  if (stap === 1 && antwoord === "Nee") {
    return res.json({ volgendeVraag: vragen[1] });
  }

  if (stap === 2 && antwoord === "Ja") {
    return res.json({ eindAdvies: adviezen.U3 });
  }

  if (stap === 2 && antwoord === "Nee") {
    return res.json({ volgendeVraag: vragen[2] });
  }

  if (stap === 3 && antwoord === "Ja") {
    return res.json({ eindAdvies: adviezen.U3 });
  }

  if (stap === 3 && antwoord === "Nee") {
    return res.json({ eindAdvies: adviezen.U5 });
  }

  return res.json({ eindAdvies: "Onbekend. Raadpleeg een zorgverlener." });
});

export default app;
