import { useState } from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const [formType, setFormTypeState] = useState("join");
  const [show, setShowState] = useState(false);

  const [username, setUsername] = useState(localStorage.getItem("username"));

  const [formData, setFormData] = useState({
    player_count: "3",
    draw_time: "45",
    round_count: "3",
    hint_count: "1",
    room_link: "",
    room_key: ""
  });


  const showForm = (type) => {
    setShowState(true);
    setFormTypeState(type);
  }

  const hideForm = (_) => {
    setShowState(false);
  }

  const updateName = (e) => {
    setUsername(e.target.value);
    localStorage.setItem("username", e.target.value);
  }

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const createroom = async (_) => {
    const res = await fetch("http://localhost:8000/create_room", {
      method: "POST",
      body: JSON.stringify({
        id: localStorage.getItem("id"),
        name: username,
        players: formData.player_count,
        duration: formData.draw_time,
        hints: formData.hint_count,
        rounds: formData.round_count
      }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log(data);

      navigate(`/game?link=${data.room_link}&pass=${data.password}`);
    }
  };

  const joinRoom = (e) => {
    e.preventDefault();
    const link = formData.room_link;
    const pass = formData.room_key;



    navigate(`/game?link=${link}&pass=${pass}`);

  }

  return (
    <div className="relative">
      {
        show ? <div className="absolute w-full h-screen bg-gray-900/60 z-10 flex justify-center items-center" onClick={hideForm}>

          <div className="content_conatiner panel" onClick={(e) => { e.stopPropagation(); }}>

            {
              formType == "join" ?

                <form className="flex flex-col w-full gap-3" onSubmit={joinRoom}>
                  <input
                    id="room_link"
                    className="common_input"
                    type="text"
                    placeholder="Room Link"
                    required
                    onChange={handleChange}
                  />

                  <input
                    id="room_key"
                    className="common_input"
                    type="text"
                    placeholder="Room Key"
                    required
                    onChange={handleChange}
                  />

                  <input
                    className="btn_primary"
                    type="submit"
                    value="Join"
                  />
                </form>

                :
                formType == "create" ?
                  <>
                    <div className="item_row">
                      <label htmlFor="player_count">Players</label>
                      <select className="common_input" id="player_count" onChange={handleChange}>
                        <option default value="3">3</option>
                        <option value="5">5</option>
                        <option value="7">7</option>
                        <option value="9">9</option>
                      </select>
                    </div>

                    <div className="item_row">
                      <label htmlFor="draw_time">Draw Time</label>
                      <select className="common_input" id="draw_time" onChange={handleChange}>
                        <option value="45">45s</option>
                        <option value="60">60s</option>
                        <option value="75">75s</option>
                        <option value="90">90s</option>
                      </select>
                    </div>

                    <div className="item_row">
                      <label htmlFor="round_count">Rounds</label>
                      <select className="common_input" id="round_count" onChange={handleChange}>
                        <option value="3">3</option>
                        <option value="5">5</option>
                        <option value="7">7</option>
                        <option value="9">9</option>
                      </select>
                    </div>

                    <div className="item_row">
                      <label htmlFor="hint_count">Hints</label>
                      <select className="common_input" id="hint_count" onChange={handleChange}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                      </select>
                    </div>
                    <input className="btn_primary" type="button" value="Create" onClick={createroom} />
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
        <input className="common_input" type="text" placeholder="User Name" value={username ?? ""} onChange={updateName} />
        <input className="btn_primary" type="button" value="Join Room" onClick={(_) => showForm("join")} />
        <input className="btn_secondary" type="button" value="Create Room" onClick={(_) => showForm("create")} />
      </div>
    </div>
  )
}

export default Home
