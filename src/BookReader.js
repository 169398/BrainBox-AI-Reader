// BookReader.js
import React from "react";

const BookReader = ({ pdfContent }) => {
  return (
    <div>
      <h2>PDF Content</h2>
      <p>{pdfContent}</p>
      {/* You can add more features to display the PDF content */}
    </div>
  );
};

export default BookReader;
