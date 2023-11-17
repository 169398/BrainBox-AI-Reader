import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import * as pdfjs from "pdfjs-dist/build/pdf";

const apiKey = "2eab152d050f4cfa9e5314114d137807";
const region = "southafricanorth";
const endpoint = `https://${region}.api.cognitive.microsoft.com/sts/v1.0/issuetoken`;

const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(apiKey, region);
const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig);

const SpeechService = {
  extractText: async (fileInput) => {
    try {
      const file = fileInput.files[0];
      if (!file) {
        throw new Error("No file selected");
      }

      const text = await readPDFText(file);
      console.log("Extracted text from PDF:", text);
      return text;
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      throw error;
    }
  },

  textToSpeech: async (text) => {
    try {
      const result = await synthesizer.speakTextAsync(text);

      if (
        result &&
        result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted
      ) {
        const audioBlob = result.audioData;
        const audioUrl = URL.createObjectURL(
          new Blob([audioBlob], { type: "audio/wav" })
        );
        return audioUrl;
      } else {
        console.error(
          `Speech synthesis failed: ${
            result ? result.errorDetails : "Unknown error"
          }`
        );
        return null;
      }
    } catch (error) {
      console.error(`Error during speech synthesis: ${error.message}`);
      return null;
    }
  },
};

const readPDFText = async (file) => {
  try {
    const dataBuffer = await file.arrayBuffer();
    const data = new Uint8Array(dataBuffer);

    const loadingTask = pdfjs.getDocument({ data });
    const pdf = await loadingTask.promise;
    const maxPages = pdf.numPages;
    let text = "";

    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      text += content.items.map((s) => s.str + " ").join("");
    }

    return text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw error;
  }
};

export default SpeechService;
