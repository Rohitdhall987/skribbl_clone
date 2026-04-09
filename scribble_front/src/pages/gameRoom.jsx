import "./gameRoom.css";
import GameCanvas from "../components/game_canvas";
import Navbar from "../components/navbar";
import { useEffect, useState } from "react";
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


  const [word, setWord] = useState("SNAKE");
  const [reveal, setRevel] = useState([1, 3]);
  const [score, setScore] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);

  const [playersData, setPlayersData] = useState([]);

  useEffect(() => {
    if (!link || !pass) return;

    const ws = new WebSocket(
      `ws://localhost:8000/join?link=${link}&pass=${pass}`
    );

    ws

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
        setPlayersData([...playersData, d["data"]]);
      }

    };

    ws.onclose = () => {
      alert("Room no longer exist");
      navigate("/");
    };

    return () => ws.close();
  }, [link, pass]);

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Navbar />
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
        <div className="chat content_conatiner"> <ChatBox /></div>
      </div>
    </div>
  )
}

export default GameRoom
