import "./navbar.css"
import { AiFillSound } from "react-icons/ai";
import { LuClock2 } from "react-icons/lu";

function Navbar({ roomData }) {
  return (
    <>
      <div className="nav_root">
        <h3 className="nav_title">Skribbl Clone</h3>
        <div className="round_details">
          <div className="clock">
            <LuClock2 />
            <span> {roomData.time}s</span>
          </div>
          <div className="round">Round {roomData.current_round}/{roomData.total_rounds}</div>
        </div>
        <div className="nav_icons">
          <AiFillSound />
        </div>
      </div>
    </>
  )
}

export default Navbar

