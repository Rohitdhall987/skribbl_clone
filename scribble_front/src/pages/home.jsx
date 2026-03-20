import { useState } from "react";
import "./home.css";

function Home() {


  const [formType, setFormTypeState] = useState("join");
  const [show, setShowState] = useState(false);


  const showForm = (type) => {
    setShowState(true);
    setFormTypeState(type);
  }

  const hideForm = (_) => {
    setShowState(false);
  }

  return (
    <div className="relative">
      {
        show ? <div className="absolute w-full h-screen bg-gray-900/60 z-10 flex justify-center items-center" onClick={hideForm}>

          <div className="content_conatiner panel" onClick={(e) => { e.stopPropagation(); }}>

            {
              formType == "join" ?
                <>
                  <input className="common_input" type="text" placeholder="Room Link" />
                  <input className="common_input" type="text" placeholder="Room Key" />
                  <input className="btn_primary" type="button" value="Join" />
                </>
                :
                formType == "create" ?
                  <>
                    <div className="item_row">
                      <label htmlFor="player_count">Players</label>
                      <select className="common_input" id="player_count">
                        <option value="3">3</option>
                        <option value="5">5</option>
                        <option value="7">7</option>
                        <option value="9">9</option>
                      </select>
                    </div>

                    <div className="item_row">
                      <label htmlFor="draw_time">Draw Time</label>
                      <select className="common_input" id="draw_time">
                        <option value="45s">45s</option>
                        <option value="60s">60s</option>
                        <option value="75s">75s</option>
                        <option value="90s">90s</option>
                      </select>
                    </div>

                    <div className="item_row">
                      <label htmlFor="round_count">Rounds</label>
                      <select className="common_input" id="round_count">
                        <option value="3">3</option>
                        <option value="5">5</option>
                        <option value="7">7</option>
                        <option value="9">9</option>
                      </select>
                    </div>

                    <div className="item_row">
                      <label htmlFor="hint_count">Hints</label>
                      <select className="common_input" id="hint_count">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                      </select>
                    </div>
                    <input className="btn_primary" type="button" value="Create" />
                  </>
                  :
                  <></>
            }

          </div>
        </div> : <></>
      }

      <h1 className="title">Skribbl Clone</h1>
      <div className="content_conatiner panel">
        <div className="temp_avatar"></div>
        <input className="common_input" type="text" placeholder="User Name" />
        <input className="btn_primary" type="button" value="Join Room" onClick={(_) => showForm("join")} />
        <input className="btn_secondary" type="button" value="Create Room" onClick={(_) => showForm("create")} />
      </div>
    </div>
  )
}

export default Home
