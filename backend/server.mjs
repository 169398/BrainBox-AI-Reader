// server.mjs
import express from "express";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import fs from "fs";
import PDFParser from "pdf-parse";

const app = express();

const apiKey = "8b3516d3-4027-49b8-a805-bef4e2e44595";
const region = "southafricanorth";
const endpoint = `https://${region}.api.cognitive.microsoft.com/sts/v1.0/issuetoken`;

const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(apiKey, region);
const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig);

app.use(express.json()); // Add this line to parse JSON requests

app.get("/", (req, res) => {
  res.send("Welcome to the Text-to-Speech Server!");
});

app.post("/text-to-speech", async (req, res) => {
  const { pdfPath } = req.body;

  if (!pdfPath) {
    return res.status(400).send("PDF path is required.");
  }

  try {
    const pdfData = fs.readFileSync(pdfPath);
    const data = await parsePDF(pdfData);

    const text = data.text || "No text found in the PDF.";

    synthesizer.speakTextAsync(
      text,
      (result) => {
        if (
          result &&
          result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted
        ) {
          res.send(result.audioData);
        } else {
          res
            .status(500)
            .send(
              `Speech synthesis failed: ${
                result ? result.errorDetails : "Unknown error"
              }`
            );
        }
      },
      (error) => {
        res.status(500).send(`Error during speech synthesis: ${error}`);
      }
    );
  } catch (error) {
    res.status(500).send(`Error reading or parsing PDF: ${error.message}`);
  }
});

const parsePDF = async (pdfData) => {
  const data = await PDFParser(pdfData);
  return data;
};

const port = 3001; // Choose any available port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
