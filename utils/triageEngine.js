import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function triageFlow(klacht, antwoorden = {}) {
  const normalized = klacht.toLowerCase();

  // Herken klacht → laad juiste triageboom
  let triageFile = null;
  if (normalized.includes("koorts") || normalized.includes("griep")) {
    triageFile = "koorts.json";
  } else if (normalized.includes("keelpijn")) {
    triageFile = "keelpijn.json";
  } else if (normalized.includes("hoofdpijn")) {
    triageFile = "hoofdpijn.json";
  } else {
    triageFile = "algemeen.json";
  }

  const filePath = path.join(__dirname, "data", "triage", triageFile);

  // Dynamisch importeren van JSON werkt beter op Vercel
  const triageData = await import(`file://${filePath}`, {
    assert: { type: "json" }
  }).then(m => m.default);

  // Zoek volgende vraag
  const gegevenAntwoorden = Object.keys(antwoorden);
  let volgendeVraag = triageData.vragen.find(v => !gegevenAntwoorden.includes(v.id));

  if (gegevenAntwoorden.length > 0) {
    const laatsteVraagId = gegevenAntwoorden[gegevenAntwoorden.length - 1];
    const laatsteVraag = triageData.vragen.find(v => v.id === laatsteVraagId);
    const antwoord = antwoorden[laatsteVraagId];

    if (laatsteVraag && laatsteVraag[antwoord]) {
      const nextStep = laatsteVraag[antwoord];
      if (triageData.uitkomsten[nextStep]) {
        return triageData.uitkomsten[nextStep];
      } else {
        volgendeVraag = triageData.vragen.find(v => v.id === nextStep);
      }
    }
  }

  if (!volgendeVraag) {
    return triageData.uitkomsten["zelfzorg"];
  }

  return {
    vraagId: volgendeVraag.id,
    vraag: volgendeVraag.tekst
  };
}
