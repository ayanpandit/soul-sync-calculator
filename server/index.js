import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/results", async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 10, 50);

  try {
    const results = await prisma.soulSyncResult.findMany({
      orderBy: { id: "desc" },
      take: limit,
    });

    return res.json(results);
  } catch (error) {
    console.error("Failed to fetch results", error);
    return res.status(500).json({ error: "Failed to fetch results" });
  }
});

app.post("/api/results", async (req, res) => {
  const { date, time, gender, yourName, theirName, result } = req.body || {};

  if (!date || !time || !gender || !yourName || !theirName || !result) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const created = await prisma.soulSyncResult.create({
      data: {
        date: new Date(date),
        time,
        gender,
        yourName,
        theirName,
        result,
      },
    });

    return res.status(201).json({ id: created.id });
  } catch (error) {
    console.error("Failed to save result", error);
    return res.status(500).json({ error: "Failed to save result" });
  }
});

const port = process.env.PORT ? Number(process.env.PORT) : 3001;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
