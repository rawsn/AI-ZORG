import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { bepaalTriage } from "./triage/engine.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ status: "Zorgassist AI actief" });
});

app.post("/api/triageflow", (req, res) => {
  const { antwoorden } = req.body;
  const result = bepaalTriage(antwoorden || []);
  res.json(result);
});

export default app;
