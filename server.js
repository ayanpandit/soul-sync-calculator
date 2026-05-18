require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/entries", async (req, res) => {
  try {
    const entries = await prisma.compatibilityEntry.findMany({
      orderBy: { timestamp: "desc" },
    });
    res.json(entries);
  } catch (error) {
    console.error("Failed to fetch entries:", error);
    res.status(500).json({ error: "Failed to fetch entries" });
  }
});

app.post("/api/entries", async (req, res) => {
  try {
    const { name1, name2, gender } = req.body;

    if (!name1 || !name2 || !gender) {
      return res.status(400).json({ error: "name1, name2 and gender are required" });
    }

    const entry = await prisma.compatibilityEntry.create({
      data: {
        name1: String(name1).trim(),
        name2: String(name2).trim(),
        gender: String(gender).trim(),
      },
    });

    res.status(201).json(entry);
  } catch (error) {
    console.error("Failed to create entry:", error);
    res.status(500).json({ error: "Failed to save entry" });
  }
});

app.delete("/api/entries", async (req, res) => {
  try {
    await prisma.compatibilityEntry.deleteMany();
    res.status(204).send();
  } catch (error) {
    console.error("Failed to clear entries:", error);
    res.status(500).json({ error: "Failed to clear entries" });
  }
});

app.listen(port, () => {
  console.log(`Soul Sync API running at http://localhost:${port}`);
});
