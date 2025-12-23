let stap = 0;
let laatsteAntwoord = "";

const vraagDiv = document.getElementById("vraag");
const buttonsDiv = document.getElementById("buttons");
const resultaatDiv = document.getElementById("resultaat");

async function laadVolgendeVraag() {
  const res = await fetch("/api/triageflow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stap, antwoord: laatsteAntwoord }),
  });
  const data = await res.json();

  if (data.volgendeVraag) {
    vraagDiv.textContent = data.volgendeVraag;
    buttonsDiv.innerHTML = `
      <button onclick="antwoordGeven('Ja')">Ja</button>
      <button onclick="antwoordGeven('Nee')">Nee</button>
    `;
  } else if (data.eindAdvies) {
    vraagDiv.textContent = "Resultaat:";
    buttonsDiv.innerHTML = "";
    resultaatDiv.textContent = data.eindAdvies;
  }
}

function antwoordGeven(antwoord) {
  laatsteAntwoord = antwoord;
  stap++;
  laadVolgendeVraag();
}

laadVolgendeVraag();
