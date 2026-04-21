import "dotenv/config";
import cors from "cors";
import express from "express";
import { getHighlights, getTrending, listArticles } from "./services/newsService.js";

const app = express();
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || "127.0.0.1";
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({
  origin: [CLIENT_ORIGIN, "http://127.0.0.1:5173", "http://localhost:5173"]
}));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "velora-api" });
});

app.get("/api/articles", async (req, res) => {
  try {
    const data = await listArticles(req.query);
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch articles right now.",
      details: error.message
    });
  }
});

app.get("/api/highlights", async (_req, res) => {
  try {
    const data = await getHighlights();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch highlights right now.",
      details: error.message
    });
  }
});

app.get("/api/trending", async (_req, res) => {
  try {
    const data = await getTrending();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch trending news right now.",
      details: error.message
    });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Velora API listening on http://${HOST}:${PORT}`);
});
