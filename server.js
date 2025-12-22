// server.js
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { getNextStep } from "./utils/triageController.js";

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

//
