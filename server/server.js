import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { generateTriageStep } from "./triageEngine.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/api/triage", async (req, res) => {
  try {
    const { klacht, antwoorden } = req.body;
    const response = await generateTriageStep(klacht, antwoorden);
    res.json(response);
  } catch (err) {
    console.error("Triage error:", err);
    res.status(500).json({ error: "Er is een interne fout opgetreden." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Zorgassist AI draait op poort ${PORT}`));
