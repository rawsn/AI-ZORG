let stap = 0;
let laatsteAntwoord = "";

const vraagDiv = document.getElementById("vraag");
const antwoordenDiv = document.getElementById("antwoorden");
const resultaatDiv = document.getElementById("resultaat");

async function startTriage() {
  stap = 0;
  laatsteAntwoord = "";
  resultaatDiv.innerHTML = "";
  await laadVolgendeVraag();
}

async function laadVolgendeVraag() {
  const res = await fetch("/api/triageflow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stap, antwoord: laatsteAntwoord }),
  });

  const data = await res.json();

  if (data.volgendeVraag) {
    toonVraag(data.volgendeVraag);
  } else if (data.eindAdvies) {
    toonResultaat(data.eindAdvies);
  }
}

function toonVraag(vraag) {
  vraagDiv.textContent = vraag;
  antwoordenDiv.innerHTML = `
    <button onclick="verwerkAntwoord('Ja')">Ja</button>
    <button onclick="verwerkAntwoord('Nee')">Nee</button>
  `;
}

function toonResultaat(advies) {
  vraagDiv.textContent = "Resultaat:";
  antwoordenDiv.innerHTML = "";
  resultaatDiv.innerHTML = `<strong>Advies:</strong> ${advies}<br><br>
    <em>Bron: NHG, NTS, Thuisarts, RIVM, KNMG</em><br>
    <small>Zorgassist AI biedt alleen zorgnavigatie en geen medische adviezen.</small>`;
}

function verwerkAntwoord(antwoord) {
  laatsteAntwoord = antwoord;
  stap++;
  laadVolgendeVraag();
}

startTriage();
