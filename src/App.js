// App.js
import React, { useState } from "react";
import BookReader from "./BookReader";
import BookUploader from "./ BookUploader";
import SpeechService from "./SpeechService"; // Update the path based on your project structure

const App = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  const handleUpload = async (file) => {
    setUploadedFile(file);
    const text = await SpeechService.extractText(file);
    setAudioUrl(await SpeechService.textToSpeech(text));
  };

  return (
    <div>
      <h1>Book Reader App</h1>
      <BookUploader onUpload={handleUpload} />
      {uploadedFile && (
        <div>
          <BookReader />
          {audioUrl && (
            <div>
              <p>Play the Audio:</p>
              <audio controls>
                <source src={audioUrl} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
