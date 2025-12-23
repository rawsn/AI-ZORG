async function stuurVraag() {
  const klacht = document.getElementById("klacht").value;
  const antwoorden = JSON.parse(localStorage.getItem("antwoorden") || "{}");

  const res = await fetch("/api/triage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ klacht, antwoorden })
  });

  const data = await res.json();
  toonResultaat(data);
}

function toonResultaat(data) {
  const div = document.getElementById("resultaat");
  if (data.vraag) {
    div.innerHTML = `<p>${data.vraag}</p>`;
  } else {
    div.innerHTML = `<b>Advies:</b> ${data.advies}<br><i>Route:</i> ${data.route}`;
  }
}
