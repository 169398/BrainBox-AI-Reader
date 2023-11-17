// BookUploader.js
import React, { useState } from "react";

const BookUploader = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target.result;
        // Assuming you want to pass the content to the parent component
        onUpload({ file: selectedFile, content });
      };

      reader.readAsText(selectedFile);
    }
  };

  return (
    <div>
      <h2>Book Uploader</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default BookUploader;
