let stap = 0;
const vraagEl = document.getElementById("vraag");
const adviesEl = document.getElementById("advies");
const buttonsEl = document.getElementById("buttons");

async function volgendeVraag(antwoord) {
  const res = await fetch("/api/triageflow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stap, antwoord })
  });

  const data = await res.json();
  console.log(data);

  if (data.vraag) {
    vraagEl.innerText = data.vraag;
    adviesEl.innerText = "";
    buttonsEl.classList.remove("hidden");
    stap++;
  } else if (data.advies) {
    vraagEl.innerText = "";
    adviesEl.innerHTML = `<strong>Advies:</strong> ${data.advies}`;
    buttonsEl.classList.add("hidden");
  }
}

document.getElementById("ja").addEventListener("click", () => volgendeVraag("Ja"));
document.getElementById("nee").addEventListener("click", () => volgendeVraag("Nee"));

// start
volgendeVraag();
