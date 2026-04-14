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


  const [word, setWord] = useState("");
  const [reveal, setRevel] = useState([]);
  const [score, setScore] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [words, setWords] = useState([]);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);


  const [roomData, setRoomData] = useState({
    creator: "",
    time: 0,
    total_rounds: 0,
    current_round: 0,
    started: false
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
      if (d.type == "player") {


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
          current_round: d.current_round,
          started: d.started
        });

        setPlayersData(d.players);
      }

      if (d.type === "start") {
        setRoomData(prev => ({
          ...prev,
          started: true,
        }))
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


      if (d.type === "turn") {
        setPlayersData((prev) =>
          prev.map((p) => ({
            ...p,
            isDrawing: p.id === d.player,
          }))
        );
        if (uid == d.player) {
          setIsDrawing(true)
        }
      }

      if (d.type === "words") {
        setWords(d.options);

        if (timerRef.current) {
          clearInterval(timerRef.current);
        }

        setTimer(20);

        timerRef.current = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              updateWord({ targer: { value: words[0] } });
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

      }

      if (d.type === "word_selected") {
        setWord(d.data);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
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

  const startGame = (_) => {
    wsRef.current.send(
      JSON.stringify({
        type: "start",
      })
    );
  };

  const updateWord = (e) => {
    setWords([]);
    setWord(e.target.value);
    wsRef.current.send(
      JSON.stringify({
        type: "word_selected",
        data: e.target.value,
      })
    );
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Navbar roomData={roomData} />
      <div className="layout flex-1 min-h-0">
        <div className=" mr-6 my-2 content_conatiner">
          <LeaderBoard playersData={playersData} />
        </div>
        <div className="game_area">
          {
            word.length > 0 &&
            <div className="word_conatiner">
              <p>{
                [...word].map((e, i) => (<span key={i}>
                  {reveal.filter(p => p == i).length > 0 ? e : "_"}
                </span>))
              }<sup>{word.length}</sup></p>
            </div>
          }

          {
            roomData.started ? (

              isDrawing && words.length > 0 ? (

                <div className="w-full h-full flex flex-col justify-center items-center">
                  <p className="text-center">{timer}s</p>
                  <p className="text-center">Please choose a word</p>

                  <div className="flex justify-center gap-3">
                    {words.map((e, i) => (
                      <input
                        key={i}
                        type="button"
                        className="btn_secondary"
                        value={e}
                        onClick={updateWord}
                      />
                    ))}
                  </div>
                </div>

              ) : word === "" ? (

                <p>Waiting for player to choose a word</p>

              ) : (

                <GameCanvas isDrawing={isDrawing} onDrawEnd={() => { }} />

              )

            ) : uid === roomData.creator ? (

              <div className="w-full h-full flex justify-center items-center">
                <input
                  className="btn_primary text-4xl"
                  type="button"
                  value="Start"
                  onClick={startGame}
                />
              </div>

            ) : (

              <p>Waiting for the creator to start the game</p>

            )
          }


        </div>
        <div className="chat content_conatiner">
          <ChatBox messages={messages} sendMessage={sendChat} />
        </div>
      </div>
    </div>
  )
}

export default GameRoom
