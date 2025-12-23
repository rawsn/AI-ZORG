import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// De basis triagevragen
const vragen = [
  "Heeft u een ongeval gehad of bent u bewusteloos?",
  "Heeft u hevige pijn of veel bloedverlies?",
  "Heeft u koorts boven de 39 graden of bent u benauwd?"
];

// De adviezen volgens richtlijnen
const adviezen = {
  U1: "Bel direct 112. Route: Spoedeisende hulp (U1).",
  U3: "Neem contact op met uw huisarts. Route: Huisarts (U3).",
  U5: "U kunt zelfzorg toepassen. Raadpleeg Thuisarts.nl (U5)."
};

// Testendpoint
app.get("/", (req, res) => {
  res.json({ status: "Zorgassist AI API actief" });
});

// Hoofd triageflow
app.post("/api/triageflow", (req, res) => {
  const { stap, antwoord } = req.body;

  if (!stap || stap === 0) {
    return res.json({ vraag: vragen[0] });
  }

  if (stap === 1 && antwoord === "Ja") return res.json({ advies: adviezen.U1 });
  if (stap === 1 && antwoord === "Nee") return res.json({ vraag: vragen[1] });

  if (stap === 2 && antwoord === "Ja") return res.json({ advies: adviezen.U3 });
  if (stap === 2 && antwoord === "Nee") return res.json({ vraag: vragen[2] });

  if (stap === 3 && antwoord === "Ja") return res.json({ advies: adviezen.U3 });
  if (stap === 3 && antwoord === "Nee") return res.json({ advies: adviezen.U5 });

  res.json({ advies: "Onbekend. Neem contact op met een zorgverlener." });
});

export default app;
