import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Fix voor ES Modules pad
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Public folder voor de website
app.use(express.static(path.join(__dirname, "public")));

// Homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Testroute – controleer of de server werkt
app.get("/api/status", (req, res) => {
  res.json({ status: "Zorgassist AI backend online ✅" });
});

// Nodig voor Vercel (GEEN app.listen!)
export default app;
