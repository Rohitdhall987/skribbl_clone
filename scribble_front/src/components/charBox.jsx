import "./charBox.css";
import { useState } from "react";
import { IoSend } from "react-icons/io5";


export default function ChatBox({ messages, sendMessage }) {
  const uid = localStorage.getItem("id");
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };



  return (

    <div className="chat_root">


      <div className="chat_title">Chat & Guess</div>

      <div className="msg_box">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender == uid ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`msg_bubble ${msg.sender == uid
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
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
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
