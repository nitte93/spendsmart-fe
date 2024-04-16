"use client";
// components/Documents.js
import React from "react";
import useSWR from "swr";
import axios from "axios";
import Link from "next/link";

const fetcher = (url) => axios.get(url).then((res) => res.data);

function Documents() {
  const { data: documents, error } = useSWR(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/documents`,
    fetcher
  );

  if (error) return <div>Failed to load</div>;
  if (!documents) return <div>Loading...</div>;

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        List of Documents
      </h1>
      <div className="space-y-4">
        {documents.map((document) => (
          <div key={document.id} className="p-5 shadow-lg rounded-lg bg-white">
            <h2 className="text-lg font-semibold text-blue-600">
              {document.file_name}
            </h2>
            <p className="text-gray-600">{document.upload_date}</p>
            <a
              href={document.file}
              className="text-blue-500 hover:text-blue-700 transition duration-300 ease-in-out"
            >
              Download
            </a>
            <Link href={`/documents/${document.id}`} legacyBehavior>
              <a className="ml-4 text-green-500 hover:text-green-700 transition duration-300 ease-in-out">
                Show Document
              </a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Documents;
export const config = { runtime: "client" }; // This marks MyComponent as a Client Component
