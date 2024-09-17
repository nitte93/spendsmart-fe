"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Card from "@/components/common/Card";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

function UploadComponent() {
  const [file, setFile] = useState(null);

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const onFileUpload = () => {
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post(`${process.env.NEXT_PUBLIC_HOST}/uploads/upload-file`, formData, {
        withCredentials: true, // This is important for including cookies with the request
      })
      .then((response) => toast.success("File uploaded successfully."))
      .catch((error) => {
        const {data}  = error.response
        let errorMessage = "Failed to upload"
        console.log(error)
        if(data.errors){
          errorMessage = Array.isArray(data.errors) ? error.errors.join(" \n") : data.errors
        }
        toast.error(errorMessage)
      });
  };

  return (
    <Card>
      <h1 className="text-lg font-semibold">Upload your file</h1>
      <input
        type="file"
        onChange={onFileChange}
        accept=".xlsx,.xls,.csv" 
        className="mt-2 mb-2 block w-full text-sm text-gray-500 border
                               border-blue-500 border-2 cursor-pointer rounded
                               file:mr-4 file:py-1 file:px-2
                               file:rounded file:border-0
                               file:text-sm file:font-semibold
                               file:bg-violet-50 file:text-violet-700
                               hover:file:bg-violet-100"
      />
      {file && (
        <>
        <button
          onClick={onFileUpload}
          title="Upload your file"
          className="px-2 py-1 bg-slate-500 text-white rounded hover:bg-green-800"
        >
          Upload <ArrowUpTrayIcon className="inline w-4 h-4 -mt-1" />
        </button>
        <button
        onClick={() => setFile(null)} // Button to clear the selected file
        title="Remove selected file"
        className="ml-2 w-8 h-8 bg-red-500 text-white rounded hover:bg-red-800"
        >
           X
        </button>
        </>
      )}
    </Card>
  );
}

export default UploadComponent;
