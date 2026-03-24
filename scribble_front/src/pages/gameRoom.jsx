import "./gameRoom.css";
import GameCanvas from "../components/game_canvas";
import Navbar from "../components/navbar";
import { useState } from "react";
import LeaderBoard from "../components/leaderBoard";
import ChatBox from "../components/charBox";


function GameRoom() {

  const [word, setWord] = useState("SNAKE");
  const [reveal, setRevel] = useState([1, 3]);

  const playersData = [
    {
      "id": 1,
      "name": "someting",
      "score": 234,
      "isDrawing": true,
    },
    {
      "id": 2,
      "name": "nobodssdsdsfsdfgdgdfgdfgdfgdfgdfsy",
      "score": 453,
      "isDrawing": false,
    },
    {
      "id": 3,
      "name": "somebody",
      "score": 234,
      "isDrawing": false,
    }
  ];

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
