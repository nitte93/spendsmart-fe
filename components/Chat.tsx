// components/Chat.js
"use-client";
import { useState } from "react";
import axios from "axios";
import useSWR, { mutate } from "swr";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Chat = ({ documentId }) => {
  const {
    data: messages,
    error,
    mutate,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/chat/${documentId}`,
    fetcher
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
        `${process.env.BACKEND_URL}/uploads/chatwithrag/${documentId}`,
        payload
      );
      console.log({ data: response.data });
      // Update the local state with both the user's message and the new response from the server
      const updatedMessages = [...messages, payload, { ...response.data }];
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
    <div className="max-w-lg mx-auto my-4">
      <div className="mb-2 bg-white shadow rounded-lg p-4">
        <div className="overflow-y-auto h-96 mb-4 space-y-2">
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
                style={{ maxWidth: "80%" }}
              >
                <p className="text-sm">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 p-2 rounded-lg mr-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
