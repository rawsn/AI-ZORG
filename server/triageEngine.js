import { fetchProtocols } from "./protocolFetcher.js";
import { extractQuestions } from "./utils/questionBuilder.js";
import { applyUrgencyRules } from "./rules/urgencyRules.js";

export async function generateTriageStep(klacht, antwoorden = {}) {
  // 1️⃣ Haal richtlijntekst op via fetcher (bv. NHG + Thuisarts)
  const richtlijnTekst = await fetchProtocols(klacht);

  // 2️⃣ Genereer mogelijke vragen op basis van de richtlijninhoud
  const vragen = extractQuestions(richtlijnTekst, antwoorden);

  // 3️⃣ Controleer spoed of meldplicht (bv. U1 → Bel 112)
  const urgentie = applyUrgencyRules(richtlijnTekst, antwoorden);

  if (urgentie?.actie) {
    return urgentie;
  }

  // 4️⃣ Kies de volgende vraag
  const volgendeVraag = vragen.find(v => !antwoorden[v.id]);

  if (!volgendeVraag) {
    return {
      advies: "Neem contact op met uw huisarts voor overleg.",
      route: "huisarts",
      urgentie: "U3",
      bronnen: ["NHG", "Thuisarts", "RIVM"]
    };
  }

  return {
    vraagId: volgendeVraag.id,
    vraag: volgendeVraag.tekst,
    opties: volgendeVraag.opties || ["ja", "nee"]
  };
}
