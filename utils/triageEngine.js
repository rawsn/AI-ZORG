// utils/triageEngine.js

export async function triageEngine(answers) {
  const klacht = (answers.klacht || "").toLowerCase().trim();
  const postcode = answers.postcode || "";

  // 🧠 Basisbeslislogica op klacht
  if (!klacht) {
    return "Geen klacht ingevoerd. Vul een klacht in om advies te krijgen.";
  }

  // Simpele logica op basis van sleutelwoorden
  if (klacht.includes("borst") || klacht.includes("benauwd")) {
    return "🚨 Spoed: Bel direct 112 of ga naar de dichtstbijzijnde SEH.";
  }

  if (klacht.includes("koorts") || klacht.includes("griep")) {
    return "Neem contact op met uw huisarts binnen 24 uur.";
  }

  if (klacht.includes("hoofdpijn")) {
    return "Zelfzorg: neem rust, drink voldoende water en gebruik eventueel paracetamol.";
  }

  if (klacht.includes("wond") || klacht.includes("bloeding")) {
    return "Bel de huisartsenpost voor beoordeling van de wond.";
  }

  if (klacht.includes("buikpijn") || klacht.includes("misselijk")) {
    return "Observeer de klachten. Als het langer dan 24 uur aanhoudt of erger wordt, neem contact op met uw huisarts.";
  }

  // Standaard advies
  return "Neem contact op met uw huisarts voor overleg over uw klacht.";
}
