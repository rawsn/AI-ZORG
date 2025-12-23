export function extractQuestions(text, antwoorden) {
  const questions = [];

  if (text.includes("ademnood") || text.includes("benauwd")) {
    questions.push({ id: "q1", tekst: "Heeft u moeite met ademhalen?" });
  }

  if (text.includes("koorts")) {
    questions.push({ id: "q2", tekst: "Heeft u hoge koorts (boven 39°C)?" });
  }

  if (text.includes("kind") && text.includes("koorts")) {
    questions.push({ id: "q3", tekst: "Gaat het om een kind jonger dan 3 maanden?" });
  }

  // Voeg fallback toe als niets gevonden
  if (questions.length === 0) {
    questions.push({ id: "q0", tekst: "Kunt u kort beschrijven wat u voelt?" });
  }

  return questions;
}
