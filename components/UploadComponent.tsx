"use client";
import React, { useState } from "react";
import axios from "axios";

function UploadComponent() {
  const [file, setFile] = useState(null);

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const onFileUpload = () => {
    const formData = new FormData();
    formData.append("file", file);
    // http://127.0.0.1:8000/
    //http://67.202.58.96/uploads/upload/
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/uploadxls`,
        formData
      )
      .then((response) => alert("File uploaded successfully"))
      .catch((error) => alert("Error uploading file"));
  };

  return (
    <div>
      <input type="file" onChange={onFileChange} />
      <button onClick={onFileUpload}>Upload!</button>
    </div>
  );
}

export default UploadComponent;
export const config = { runtime: "client" }; // This marks MyComponent as a Client Component
