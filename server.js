// server.js
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Utils
import { triageEngine } from "./utils/triageEngine.js";
import { locationRouter } from "./utils/locationRouter.js";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Fix for dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static HTML (your interface)
app.use(express.static(path.join(__dirname, "public")));

// Basic route for homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ---------- API ROUTES ---------- //

// 1️⃣ Health check
app.get("/api/status", (req, res) => {
  res.json({ status: "Zorgassist AI backend online ✅" });
});

// 2️⃣ Triage endpoint
app.post("/api/triage", async (req, res) => {
  try {
    const answers = req.body;
    const result = await triageEngine(answers);
    res.json({ success: true, result });
  } catch (err) {
    console.error("Triage error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3️⃣ Location routing endpoint
app.post("/api/route", async (req, res) => {
  try {
    const { complaint, location } = req.body;
    const route = await locationRouter(complaint, location);
    res.json({ success: true, route });
  } catch (err) {
    console.error("Routing error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4️⃣ Data check endpoint
app.get("/api/data/:file", (req, res) => {
  const file = req.params.file;
  const filePath = path.join(__dirname, "data", `${file}.json`);

  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf-8");
    res.type("json").send(content);
  } else {
    res.status(404).json({ error: "Bestand niet gevonden" });
  }
});

// ---------- EXPORT FOR VERCEL ---------- //
// ❌ Geen app.listen() gebruiken op Vercel!
export default app;
