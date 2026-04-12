import "./gameRoom.css";
import GameCanvas from "../components/game_canvas";
import Navbar from "../components/navbar";
import { useEffect, useRef, useState } from "react";
import LeaderBoard from "../components/leaderBoard";
import ChatBox from "../components/charBox";
import { useNavigate, useSearchParams } from "react-router-dom";


function GameRoom() {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const link = searchParams.get("link");
  const pass = searchParams.get("pass");
  const uid = localStorage.getItem("id");
  const uname = localStorage.getItem("username");

  const wsRef = useRef(null);


  const [word, setWord] = useState("SNAKE");
  const [reveal, setRevel] = useState([1, 3]);
  const [score, setScore] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [messages, setMessages] = useState([]);

  const [roomData, setRoomData] = useState({
    creator: "",
    time: 0,
    total_rounds: 0,
    current_round: 0
  });

  const [playersData, setPlayersData] = useState([]);

  useEffect(() => {
    if (!link || !pass) return;

    console.log(uid)
    const ws = new WebSocket(
      `ws://localhost:8000/join?link=${link}&pass=${pass}`
    );

    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Connected");
      ws.send(JSON.stringify({
        type: "player",
        data: {
          id: uid,
          name: uname,
          score: score,
          isDrawing: isDrawing
        }
      }));
    };



    ws.onmessage = (msg) => {
      const d = JSON.parse(msg.data);
      console.log(d);
      if (d["type"] == "player") {


        setPlayersData((prev) => {
          const exists = prev.find(p => p.id === d.data.id);
          if (exists) {
            return prev.map(p => p.id === d.data.id ? d.data : p);
          }
          return [...prev, d.data];
        });


      }
      if (d.type === "init") {
        setRoomData({
          creator: d.creator,
          time: d.time,
          total_rounds: d.total_rounds,
          current_round: d.current_round
        });

        setPlayersData(d.players);
      }


      if (d.type === "chat") {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: d.text,
            sender: d.sender,
          },
        ]);
      }


    };

    ws.onclose = () => {
      alert("Room no longer exist");
      navigate("/");
    };

    return () => ws.close();
  }, [link, pass]);

  const sendChat = (text) => {
    wsRef.current.send(
      JSON.stringify({
        type: "chat",
        sender: uid,
        text: text,
      })
    );


  };


  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Navbar roomData={roomData} />
      <div className="layout flex-1 min-h-0">
        <div className=" mr-6 my-2 content_conatiner">
          <LeaderBoard playersData={playersData} />
        </div>
        <div className="game_area">
          <div className="word_conatiner">
            <p>{
              [...word].map((e, i) => (<span key={i}>
                {reveal.filter(p => p == i).length > 0 ? e : "_"}
              </span>))
            }<sup>{word.length}</sup></p>
          </div>
          <GameCanvas />
        </div>
        <div className="chat content_conatiner">
          <ChatBox messages={messages} sendMessage={sendChat} />
        </div>
      </div>
    </div>
  )
}

export default GameRoom
