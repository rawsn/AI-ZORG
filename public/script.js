let antwoorden = [];

async function stuurAntwoord(tekst) {
  antwoorden.push(tekst);
  const res = await fetch("/api/triageflow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ antwoorden })
  });
  const data = await res.json();

  const vraagEl = document.getElementById("vraag");
  const adviesEl = document.getElementById("advies");

  if (data.vraag) {
    vraagEl.innerText = data.vraag;
    adviesEl.innerText = "";
  } else if (data.advies) {
    vraagEl.innerText = "";
    adviesEl.innerHTML = `<strong>Advies:</strong> ${data.advies}<br><small>Bron: ${data.bron}</small>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("invoer").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const tekst = e.target.value.trim();
      if (tekst) {
        stuurAntwoord(tekst);
        e.target.value = "";
      }
    }
  });

  document.getElementById("vraag").innerText = "Wat is uw klacht?";
});
