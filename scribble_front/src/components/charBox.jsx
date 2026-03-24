import "./charBox.css";
import { useState } from "react";
import { IoSend } from "react-icons/io5";


export default function ChatBox() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey!", sender: "bot" },
    { id: 2, text: "Hello 👋", sender: "user" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "This is a dummy reply 🤖",
          sender: "bot",
        },
      ]);
    }, 800);
  };

  return (

    <div className="chat_root">


      <div className="chat_title">Chat & Guess</div>

      <div className="msg_box">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`msg_bubble ${msg.sender === "user"
                ? "sent"
                : "recive"
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="in_root">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="chat_in"
        />
        <button
          onClick={sendMessage}
          className="btn_primary_rounded "
        >
          <IoSend />
        </button>
      </div>
    </div>
  );
}
