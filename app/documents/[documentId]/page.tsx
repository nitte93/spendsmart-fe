"use client";
import { useState, useMemo } from "react";
import useSWR from "swr";
import axios from "axios";
import Link from "next/link";
import TransactionsTable from "../../../components/TransactionsTable";
import Chat from "../../../components/Chat";

const fetcher = (url: string) =>
  axios.get(url, { withCredentials: true }).then((res) => res.data);

export default function Page({ params }: { params: { documentId: string } }) {
  const { documentId } = params;
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("document");


  const swrKey = useMemo(() => 
    documentId ? `${process.env.NEXT_PUBLIC_HOST}/uploads/documents/${documentId}` : null,
    [documentId]
  );
  const { data, error, isLoading, mutate } = useSWR(swrKey, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  }
);

  const handleInputChange = (index:number, field:string, value:string) => {
    const newTransactions = transactions.map((transaction, i) =>
      i === index ? { ...transaction, [field]: value } : transaction
    );
    mutate(newTransactions, false); // Optimistically update the local data without revalidation
  };
  const saveTransactions = () => {
    setIsSaving(true);
    axios
      .post("/api/transaction/save", transactions)
      .then(() => {
        alert("Transactions saved!");
        mutate(); // Revalidate the cache after saving
        setIsSaving(false);
      })
      .catch((error) => {
        console.error("Error saving transactions:", error);
        setIsSaving(false);
      });
  };

  if (error) return <div>Failed to load the document.</div>;
  if (isLoading) return <div>Loading...</div>;
  const { document, transactions } = data;

  return (
    <div className="flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md sticky top-10 h-screen overflow-y-auto">
        <nav className="mt-10">
          <Link
            href={`/documents/${documentId}?tab=document`}
            className={`block py-2 px-4 text-sm hover:bg-gray-200 ${
              activeTab === "document" ? "bg-gray-200 font-semibold" : ""
            }`}
            onClick={() => setActiveTab("document")}
          >
            Your Document
          </Link>
          <Link
            href={`/documents/${documentId}?tab=chat`}
            className={`block py-2 px-4 text-sm hover:bg-gray-200 ${
              activeTab === "chat" ? "bg-gray-200 font-semibold" : ""
            }`}
            onClick={() => setActiveTab("chat")}
          >
            Chat to your document
          </Link>
          <Link
            href={`/documents/${documentId}?tab=report`}
            className={`block py-2 px-4 text-sm hover:bg-gray-200 ${
              activeTab === "report" ? "bg-gray-200 font-semibold" : ""
            }`}
            onClick={() => setActiveTab("report")}
          >
            Report
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <div className="p-10">
          <div className="h-auto">
            {activeTab === "document" && (
              <>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                  Document Details
                </h1>
                <TransactionsTable
                  transactions={transactions}
                  handleInputChange={handleInputChange}
                  isSaving={isSaving}
                  saveTransactions={saveTransactions}
                />
              </>
            )}

            {activeTab === "chat" && (
              // <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="overflow-hidden">
                <h2 className="text-xl font-semibold p-4 border-b">Chat</h2>
                <Chat documentId={documentId} />
              </div>
            )}

            {activeTab === "report" && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Report</h2>
                <p>This is a dummy report for the document.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
