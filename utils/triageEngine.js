export async function runRouting(klacht, antwoorden) {
  const vraag = "Is er sprake van spoed (benauwdheid, hevige pijn, bewustzijnsverlies)?";
  if (!antwoorden.spoed) {
    return { vraagId: "spoed", vraag };
  }
  if (antwoorden.spoed === "ja") {
    return { advies: "Bel direct 112", route: "spoedeisende hulp", urgentie: "U1" };
  }
  const duur = antwoorden.duur;
  if (!duur) {
    return { vraagId: "duur", vraag: "Heeft u de klacht langer dan 3 dagen?" };
  }
  if (duur === "ja") {
    return { advies: "Neem contact op met uw huisarts", route: "huisarts", urgentie: "U3" };
  }
  return { advies: "Zelfzorg is voldoende, raadpleeg Thuisarts.nl", route: "zelfzorg", urgentie: "U5" };
}
