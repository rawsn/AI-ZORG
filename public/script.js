const chat = document.getElementById("chat");
const startBtn = document.getElementById("start-btn");
const userInput = document.getElementById("user-input");
const postcodeInput = document.getElementById("postcode");

let antwoorden = {};
let klacht = "";
let postcode = "";

function addMessage(text, sender = "bot") {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.innerHTML = text;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

async function stuurAntwoord(id, value) {
  antwoorden[id] = value;
  const res = await fetch("/api/route", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ klacht, antwoorden, postcode })
  });
  const data = await res.json();
  toonResultaat(data);
}

function toonVraag(data) {
  addMessage(data.vraag);
  const optDiv = document.createElement("div");
  optDiv.classList.add("options");
  ["Ja", "Nee"].forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.classList.add("option-btn");
    btn.onclick = () => stuurAntwoord(data.vraagId, opt.toLowerCase());
    optDiv.appendChild(btn);
  });
  chat.appendChild(optDiv);
}

function toonAdvies(data) {
  let adviesHTML = `
    <div class="advice-box">
      <h3>${data.advies}</h3>
      <p><strong>Route:</strong> ${data.route}</p>
      <p><strong>Urgentie:</strong> ${data.urgentie}</p>
    </div>
    <div class="source">
      <p>Gebaseerd op: NHG, NTS, Thuisarts, RIVM, KNMG-richtlijnen.</p>
      <p>${data.legal?.doel || ""}</p>
    </div>
  `;
  addMessage(adviesHTML, "bot");
}

function toonResultaat(data) {
  if (data.vraag) {
    toonVraag(data);
  } else {
    toonAdvies(data);
  }
}

startBtn.addEventListener("click", async () => {
  klacht = userInput.value.trim();
  postcode = postcodeInput.value.trim();
  if (!klacht) return alert("Voer een klacht in.");
  chat.innerHTML = "";
  addMessage(`U: ${klacht}`, "user");
  const res = await fetch("/api/route", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ klacht, antwoorden, postcode })
  });
  const data = await res.json();
  toonResultaat(data);
});
