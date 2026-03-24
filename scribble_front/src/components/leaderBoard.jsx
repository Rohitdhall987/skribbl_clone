import { FaPaintbrush } from "react-icons/fa6";
import "./leaderBoard.css"

function LeaderBoard({ playersData }) {

  return (
    <>
      {playersData.map((e, i) => (
        <div key={i} className={"player_card " + (e.isDrawing ? "drawing" : "")} >
          <div className="flex items-center">
            <div className="w-full overflow-hidden">
              <p className="text-xl font-semibold">{e.name}</p>
              <p className="text-sm">{e.score}</p>

            </div>

            {
              e.isDrawing ? <FaPaintbrush /> : <></>
            }
          </div>
        </div >
      ))
      }
    </>
  )
}

export default LeaderBoard;
