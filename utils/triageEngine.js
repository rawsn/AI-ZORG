import fs from "fs";
import path from "path";

export async function triageFlow(klacht, antwoorden = {}) {
  const normalized = klacht.toLowerCase();

  // Herken klacht → laad juiste triageboom
  let triageFile = null;
  if (normalized.includes("koorts") || normalized.includes("griep")) {
    triageFile = "koorts.json";
  } else if (normalized.includes("keelpijn")) {
    triageFile = "keelpijn.json";
  } else {
    // fallback
    triageFile = "algemeen.json";
  }

  const filePath = path.join(process.cwd(), "data", "triage", triageFile);
  const triageData = JSON.parse(fs.readFileSync(filePath, "utf8"));

  // Zoek volgende vraag
  const gegevenAntwoorden = Object.keys(antwoorden);
  let volgendeVraag = triageData.vragen.find(v => !gegevenAntwoorden.includes(v.id));

  // Kijk of vorige vraag een directe uitkomst opleverde
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

  // Geen verdere vragen → standaard zelfzorg
  if (!volgendeVraag) {
    return triageData.uitkomsten["zelfzorg"];
  }

  // Volgende vraag teruggeven
  return {
    vraagId: volgendeVraag.id,
    vraag: volgendeVraag.tekst
  };
}
