// server.js
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { triageEngine } from "./utils/triageEngine.js";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Fix voor ES modules pad
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Public folder (frontend)
app.use(express.static(path.join(__dirname, "public")));

// Homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Gezondheidstest van de server
app.get("/api/status", (req, res) => {
  res.json({ status: "Zorgassist AI backend online ✅" });
});

// De triage route
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

// Export voor Vercel
export default app;
