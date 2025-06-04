// server.js
// npm install express multer dotenv openai fluent-ffmpeg ffmpeg-static

const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { OpenAI } = require("openai");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
require("dotenv").config({ path: path.join(__dirname, ".env") });

ffmpeg.setFfmpegPath(ffmpegPath);

console.log("DEBUG KEY:", process.env.OPENAI_API_KEY ? "[PRESENT]" : "[NOT SET]");

console.log(
  "Loading configuration. API key present:",
  !!process.env.OPENAI_API_KEY
);

const app = express();
const upload = multer({ dest: "uploads/" });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.static(path.join(__dirname, "public")));

app.post("/transcribe", upload.single("audio"), async (req, res) => {
  console.log("/transcribe request received");
  if (!req.file) {
    console.error("No audio file uploaded");
    return res.status(400).json({ error: "No audio file uploaded" });
  }

  const tmpPath = req.file.path;
  const webmPath = `${tmpPath}.webm`;
  fs.renameSync(tmpPath, webmPath);

  const { size } = fs.statSync(webmPath);
  if (size === 0) {
    fs.unlinkSync(webmPath);
    return res.status(400).json({ error: "Empty audio file" });
  }

  console.log("Audio file received:", req.file);

  // Convert to WAV format
  const wavPath = `${tmpPath}.wav`;
  console.log(`Converting ${webmPath} → ${wavPath}`);
  try {
    await new Promise((resolve, reject) => {
      ffmpeg(webmPath)
        .toFormat("wav")
        .on("error", reject)
        .on("end", resolve)
        .save(wavPath);
    });
    console.log("Conversion to WAV completed.");
    fs.unlinkSync(webmPath);

    // Transcribe with OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(wavPath),
      model: "whisper-1",
    });

    fs.unlinkSync(wavPath);
    console.log("Temporary files deleted");

    res.json({ text: transcription.text });
  } catch (err) {
    console.error("Transcription or conversion failed:", err);
    if (fs.existsSync(webmPath)) fs.unlinkSync(webmPath);
    if (fs.existsSync(wavPath)) fs.unlinkSync(wavPath);
    res.status(500).json({ error: "Transcription failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
