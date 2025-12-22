import express from "express";
import bodyParser from "body-parser";
import { triageEngine } from "./utils/triageEngine.js";
import { findProviders } from "./utils/locationRouter.js";

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/api/triage", async (req, res) => {
  const { complaint, postcode } = req.body;
  const result = triageEngine(complaint);
  const providers = await findProviders(postcode, result.type);
  res.json({ result, providers });
});

export default app;
