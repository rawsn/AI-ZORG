import express from "express";
import bodyParser from "body-parser";
import { triageFlow } from "./triageEngine.js";

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/api/route", async (req, res) => {
  try {
    const { klacht, antwoorden, postcode } = req.body;
    const result = await triageFlow(klacht, antwoorden);
    res.json({
      ...result,
      legal: {
        doel: "Zorgassist AI biedt alleen zorgnavigatie en geen medische adviezen.",
        privacy: "Alle gegevens zijn anoniem en voldoen aan de AVG.",
        bron: result.bron || ["NHG", "NTS", "RIVM", "Thuisarts", "KNMG"]
      }
    });
  } catch (err) {
    console.error("Fout in triage:", err);
    res.status(500).json({ fout: "Er ging iets mis in de triage." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Zorgassist AI draait op poort ${PORT}`));

