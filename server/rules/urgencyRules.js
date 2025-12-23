export function applyUrgencyRules(text, antwoorden) {
  if (text.match(/ademnood|bewusteloos|onregelmatig ademhalen/i)) {
    return {
      advies: "Bel direct 112",
      route: "spoedeisende hulp",
      urgentie: "U1"
    };
  }

  return null;
}
