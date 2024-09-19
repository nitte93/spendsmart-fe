// components/Chat.js
"use-client";
import { useState } from "react";
import axios from "axios";
import useSWR, { mutate } from "swr";
import QueryResult from "./QueryResult";

const fetcher = (url) =>
  axios.get(url, { withCredentials: true }).then((res) => res.data);

const Chat = ({ documentId }) => {
  const {
    data: messages,
    error,
    mutate,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_HOST}/uploads/chat/${documentId}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const payload = {
      documentId,
      message: newMessage,
      sender: "user",
    };
    // Add user's message optimistically
    mutate((messages) => {
      console.log({ goga: messages });
      return [...messages, payload];
    }, false);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_HOST}/uploads/chatwithrag/${documentId}`,
        payload,
        { withCredentials: true }
      );
      console.log({ data: response.data });
      const { data } = response.data
      // Update the local state with both the user's message and the new response from the server
      const updatedMessages = [...messages, payload, { ...data }];
      console.log({ updatedMessages });
      mutate(updatedMessages, false); // Optimistically update without revalidation
      setNewMessage(""); // Clear the input field after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (error) return <div>Failed to load messages.</div>;
  if (!messages) return <div>Loading...</div>;
  console.log({ messages });
  return (
    <div className="flex flex-col h-[calc(100vh-20rem)]">
      <div className="flex-grow overflow-hidden">
        <div className="h-full overflow-y-auto p-4 space-y-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "admin" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`p-2 rounded shadow ${
                  msg.sender === "admin"
                    ? "bg-blue-100 border-blue-500 text-blue-700"
                    : "bg-gray-100 border-gray-500 text-gray-700"
                }`}
                style={{ maxWidth: "100%" }}
              >
                <p className="text-sm">{msg.message && <QueryResult response={msg} />}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4">
        <form onSubmit={sendMessage} className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow border border-gray-300 p-2 rounded-lg mr-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
export const config = { runtime: "client" }; // This marks MyComponent as a Client Component
