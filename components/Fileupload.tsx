// src/FileUpload.js
import React, { useState } from "react";

const FileUpload = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]); // Set the first file
  };

  const handleUpload = () => {
    // Handle the file upload logic here
    alert(`File ${file.name} is ready for upload!`);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="p-6 bg-white rounded shadow-md">
        <h1 className="text-lg font-semibold">Upload your file</h1>
        <input
          type="file"
          onChange={handleFileChange}
          className="mt-4 mb-2 block w-full text-sm text-gray-500
                               file:mr-4 file:py-2 file:px-4
                               file:rounded file:border-0
                               file:text-sm file:font-semibold
                               file:bg-violet-50 file:text-violet-700
                               hover:file:bg-violet-100"
        />
        {file && (
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Upload
          </button>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
