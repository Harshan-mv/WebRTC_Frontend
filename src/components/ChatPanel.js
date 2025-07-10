import { useEffect, useRef, useState } from "react";
import { useSocket } from "../context/SocketContext";

function ChatPanel({ roomId, user }) {
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const bottomRef = useRef();

  useEffect(() => {
    socket?.on("chat-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket?.on("user-typing", (name) => {
      setTypingUser(name);
      setTimeout(() => setTypingUser(""), 3000);
    });

    return () => {
      socket?.off("chat-message");
      socket?.off("user-typing");
    };
  }, [socket]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (text.trim()) {
      const msg = {
        user: user.name,
        profile: user.picture,
        time: new Date().toLocaleTimeString(),
        text,
      };
      socket.emit("chat-message", { roomId, ...msg });
      setMessages((prev) => [...prev, msg]);
      setText("");
    }
  };

  const handleTyping = () => {
    socket.emit("typing", { roomId, user });
  };

  return (
    <div className="w-full md:w-1/3 h-64 overflow-y-auto border-t mt-4 bg-white rounded">
      <div className="p-2 font-bold bg-gray-100">Chat</div>
      <div className="p-2 h-44 overflow-y-scroll">
        {messages.map((m, idx) => (
          <div key={idx} className="mb-2">
            <div className="text-sm font-semibold">
              {m.user} <span className="text-gray-400 text-xs">{m.time}</span>
            </div>
            <div className="text-sm">{m.text}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      {typingUser && (
        <div className="text-xs px-3 text-gray-500">💬 {typingUser} is typing...</div>
      )}
      <div className="flex border-t">
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            handleTyping();
          }}
          placeholder="Type a message..."
          className="flex-grow p-2"
        />
        <button onClick={sendMessage} className="px-4 bg-blue-500 text-white">
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatPanel;
