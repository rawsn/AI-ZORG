let antwoorden = [];
const chatWindow = document.getElementById("chat-window");
const input = document.getElementById("invoer");
const sendButton = document.getElementById("send");

function voegBerichtToe(tekst, type = "bot") {
  const div = document.createElement("div");
  div.classList.add("message", type);
  div.innerHTML = tekst;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function typingIndicator() {
  const div = document.createElement("div");
  div.classList.add("typing");
  div.id = "typing";
  div.innerText = "Zorgassist AI is aan het nadenken...";
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove();
}

async function stuurAntwoord(tekst) {
  if (!tekst.trim()) return;
  voegBerichtToe(tekst, "user");
  input.value = "";
  antwoorden.push(tekst);
  typingIndicator();

  try {
    const res = await fetch("/api/triageflow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ antwoorden })
    });

    const data = await res.json();
    removeTyping();

    if (data.vraag) {
      voegBerichtToe(data.vraag, "bot");
    } else if (data.advies) {
      voegBerichtToe(`<strong>Advies:</strong> ${data.advies}<br><small>Bron: ${data.bron}</small>`, "bot");
    } else {
      voegBerichtToe("Ik begrijp uw antwoord niet goed. Kunt u het anders verwoorden?", "bot");
    }
  } catch (err) {
    removeTyping();
    voegBerichtToe("Er is een verbindingsfout. Probeer het opnieuw.", "bot");
  }
}

sendButton.addEventListener("click", () => stuurAntwoord(input.value));
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") stuurAntwoord(input.value);
});

// Startvraag
window.onload = () => {
  voegBerichtToe("Welkom bij Zorgassist AI. Wat is uw klacht?", "bot");
};
