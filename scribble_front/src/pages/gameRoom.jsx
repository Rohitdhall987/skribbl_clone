import "./gameRoom.css";
import GameCanvas from "../components/game_canvas";
import Navbar from "../components/navbar";


function GameRoom() {
  return (
    <>
      <Navbar />
      <div className="layout">
        <div className="leader_board"> leader board</div>
        <div className="game_area">
          <div> word</div>
          <GameCanvas />
        </div>
        <div className="chat"> chat</div>
      </div>
    </>
  )
}

export default GameRoom
