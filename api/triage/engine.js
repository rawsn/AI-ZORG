import fs from "fs";
import path from "path";

const __dirname = path.resolve();
const base = path.join(__dirname, "api", "triage");

const nhg = JSON.parse(fs.readFileSync(path.join(base, "nhg_rules.json")));
const nts = JSON.parse(fs.readFileSync(path.join(base, "nts_rules.json")));
const thuisarts = JSON.parse(fs.readFileSync(path.join(base, "thuisarts.json")));
const rivm = JSON.parse(fs.readFileSync(path.join(base, "rivm_rules.json")));
const knmg = JSON.parse(fs.readFileSync(path.join(base, "knmg_legal.json")));

export function bepaalTriage(antwoordGeschiedenis) {
  const laatste = antwoordGeschiedenis.at(-1);

  if (laatste.includes("ongeluk") || laatste.includes("bewusteloos")) {
    return {
      vraag: null,
      advies: nts.noodsituatie,
      bron: "NTS spoedprotocol"
    };
  }

  if (laatste.includes("koorts") || laatste.includes("griep")) {
    return {
      vraag: "Heeft u ook moeite met ademhalen of pijn op de borst?",
      advies: null,
      bron: "NHG koortsprotocol"
    };
  }

  if (laatste.includes("keelpijn")) {
    return {
      vraag: "Kunt u nog goed slikken?",
      advies: null,
      bron: "NHG keelpijnprotocol"
    };
  }

  if (laatste.includes("nee") && antwoordGeschiedenis.length > 1) {
    return {
      advies: thuisarts.algemeen_zelfzorg,
      bron: "Thuisarts.nl"
    };
  }

  return {
    vraag: "Kunt u uw klacht iets meer beschrijven (bijv. pijn, hoesten, uitslag)?",
    bron: "AI-initialisatie"
  };
}
