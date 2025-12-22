import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { runRouting } from "./utils/triageEngine.js";
import { getZorgToegang } from "./utils/routingEngine.js";
import { checkMeldplicht } from "./utils/meldplichtCheck.js";
import { bepaalZorgstructuur } from "./utils/zorgStructuurEngine.js";
import { zoekZorgaanbieders } from "./utils/zorgLocaties.js";
import { getLegalInfo } from "./utils/legalCheck.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/route", async (req, res) => {
  const { klacht, antwoorden, postcode } = req.body;
  const result = await runRouting(klacht, antwoorden);
  const toegang = getZorgToegang(result.route);
  const meldplicht = checkMeldplicht(klacht);
  const structuur = bepaalZorgstructuur(result.route);
  const locaties = postcode ? await zoekZorgaanbieders(postcode, toegang.route) : [];
  const legal = getLegalInfo();
  res.json({ ...result, toegang, meldplicht, structuur, locaties, legal });
});

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Zorgassist AI draait op poort ${PORT}`));
