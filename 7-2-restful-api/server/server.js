import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

import { Song } from "./models/song.model.js";

const app = express();
const PORT = process.env.PORT || 5174;

app.use(cors());              
app.use(express.json());

try {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Mongo connected");
} catch (err) {
  console.error("Connection error:", err.message);
}

// api/songs (Read all songs)
app.get("/api/songs", async (req, res) => {
  const rows = await Song.find().sort({ createdAt: -1 });
  res.json(rows);
});

app.get("/api/songs/:id", async (req, res) => {
  const s = await Song.findById(req.params.id);
  if (!s) return res.status(404).json({ message: "Song not found" });
  res.json(s);
});

// api/songs (Insert song)
app.post("/api/songs", async (req, res) => {
  try {
    const { title = "", artist = "", year } = req.body || {};
    const created = await Song.create({
      title: title.trim(),
      artist: artist.trim(),
      year
    });
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message || "Something went wrong" });
  }
});

// /api/songs/:id (Update song)


// /api/songs/:id (Delete song)

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));