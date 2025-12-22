// utils/triageController.js
import fs from "fs";
import path from "path";
import { fetchThuisarts, fetchRIVM } from "./dataFetcher.js";

export async function getNextStep(klacht, antwoorden) {
  const protocolPath = path.join(process.cwd(), "data", `${klacht}.json`);
  let protocol = null;

  if (fs.existsSync(protocolPath)) {
    protocol = JSON.parse(fs.readFileSync(protocolPath, "utf8"));
  }

  // Geen lokaal protocol gevonden → probeer online bronnen
  if (!protocol) {
    const extra = await fetchThuisarts(klacht) || await fetchRIVM(klacht);
    return extra
      ? { type: "advies", message: `Ik heb geen specifiek protocol, maar ${extra}` }
      : { type: "error", message: "Geen informatie gevonden over deze klacht." };
  }

  // Triage-logica
  let current = "v1";
  for (const [vraagId, antwoord] of Object.entries(antwoorden)) {
    const v = protocol.vragen[vraagId];
    if (!v) break;
    const next = v.volgend[antwoord.toLowerCase()];
    if (next.startsWith("einde_")) {
      return { type: "advies", message: protocol.eindes[next] };
    }
    current = next;
  }

  const nextQ = protocol.vragen[current];
  if (!nextQ) {
    return { type: "error", message: "Onvolledig protocol of fout in data." };
  }

  return {
    type: "vraag",
    vraagId: current,
    vraag: nextQ.vraag,
    antwoordType: nextQ.type
  };
}
