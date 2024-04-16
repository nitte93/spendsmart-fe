"use client";
import { useState } from "react";
import useSWR from "swr";
import axios from "axios";
import TransactionsTable from "../../../components/TransactionsTable";
import Chat from "../../../components/Chat";

const fetcher = (url:string) => axios.get(url).then((res) => res.data);

export default function Page({ params }: { params: { documentId: string } }) {
  // Check if the router is ready
  // @ts-ignore
  console.log({ params });
  const { documentId } = params;
  const [isSaving, setIsSaving] = useState(false);
  const { data, error, isLoading, mutate } = useSWR(
    documentId
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/documents/${documentId}`
      : '',
    fetcher
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
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Document Details:
        {/* {document.file_name} */}
      </h1>
      <p className="text-gray-600 mb-4">
        Document Content:
        {/* {document.content} */}
      </p>
      <Chat documentId={documentId} />
      <TransactionsTable
        transactions={transactions}
        handleInputChange={handleInputChange}
        isSaving={isSaving}
        saveTransactions={saveTransactions}
      />
    </div>
  );
}
