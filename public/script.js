// Zorgassist AI – interactieve triageflow

let stap = 0;
let laatsteAntwoord = "";
const vraagDiv = document.getElementById("vraag");
const buttonsDiv = document.getElementById("buttons");
const resultaatDiv = document.getElementById("resultaat");

// Start direct bij laden
window.addEventListener("DOMContentLoaded", () => {
  laadVolgendeVraag();
});

async function laadVolgendeVraag() {
  try {
    // Vraag backend om volgende vraag of eindadvies
    const res = await fetch("/api/triageflow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stap, antwoord: laatsteAntwoord }),
    });

    const data = await res.json();

    // Als backend nog een vraag teruggeeft
    if (data.volgendeVraag) {
      vraagDiv.textContent = data.volgendeVraag;
      buttonsDiv.innerHTML = `
        <button onclick="antwoordGeven('Ja')">Ja</button>
        <button onclick="antwoordGeven('Nee')">Nee</button>
      `;
      resultaatDiv.textContent = "";
    }
    // Als backend eindadvies teruggeeft
    else if (data.eindAdvies) {
      vraagDiv.textContent = "Advies:";
      buttonsDiv.innerHTML = "";
      resultaatDiv.textContent = data.eindAdvies;
    } else {
      vraagDiv.textContent = "Er ging iets mis, probeer opnieuw.";
    }
  } catch (err) {
    console.error("Fout:", err);
    vraagDiv.textContent = "Verbindingsfout met Zorgassist AI.";
  }
}

function antwoordGeven(antwoord) {
  laatsteAntwoord = antwoord;
  stap++;
  laadVolgendeVraag();
}
