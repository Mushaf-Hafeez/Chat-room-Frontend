import { nanoid } from "nanoid";
import { useMemo } from "react";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const App = () => {
  let userId = useMemo(() => {
    return nanoid();
  }, []);

  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const socket = useMemo(() => {
    return io(backendURL, { auth: { userId } });
  }, []);

  // state for message input
  const [message, setMessage] = useState();
  const [messages, setMessages] = useState([]);

  // handle submit function
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(message);
    socket.emit("send-message", message);
    setMessage("");
  };

  useEffect(() => {
    socket.on("receive-messages", (data) => {
      setMessages(data);
    });
  });

  useEffect(() => {
    socket.on("connection", () => {
      console.log("connected");
    });
  });

  return (
    <main className="relative min-h-screen w-full text-xl px-24 py-10">
      <div>
        {messages &&
          messages.length > 0 &&
          messages.map((msg, index) => (
            <div
              className={`flex ${
                msg.userId == userId ? "justify-start" : "justify-end"
              }`}
              key={index}
            >
              <p>{msg.text}</p>
            </div>
          ))}
      </div>
      {/* {/* message input */}
      <form
        onSubmit={handleSubmit}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-4"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="type message..."
          className="px-4 py-2 rounded border-2 border-black"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded cursor-pointer bg-black text-white"
        >
          Send
        </button>
      </form>
    </main>
  );
};

export default App;
