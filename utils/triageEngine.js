import nhg from "../data/nhg_rules.json" assert { type: "json" };
import nts from "../data/nts_rules.json" assert { type: "json" };
import thuisarts from "../data/thuisarts_links.json" assert { type: "json" };
import rivm from "../data/rivm_public.json" assert { type: "json" };

export function triageEngine(complaint) {
  const text = complaint.toLowerCase();

  for (const rule of nts.spoed) {
    if (text.includes(rule.keyword))
      return { urgency: "U1", type: "seh", advice: rule.advice };
  }

  for (const rule of nhg.huisarts) {
    if (text.includes(rule.keyword))
      return { urgency: "U3", type: "huisarts", advice: rule.advice };
  }

  for (const rule of rivm.public) {
    if (text.includes(rule.keyword))
      return { urgency: "Publiek", type: "ggd", advice: rule.advice };
  }

  for (const rule of thuisarts.links) {
    if (text.includes(rule.keyword))
      return {
        urgency: "U5",
        type: "zelfzorg",
        advice: `Zelfzorgadvies: ${rule.url}`
      };
  }

  return {
    urgency: "U5",
    type: "zelfzorg",
    advice: "Geen spoed. Raadpleeg Thuisarts.nl bij twijfel."
  };
}
