import { Route, Routes } from "react-router-dom"
import "./App.css"
import GameCanvas from "./components/game_canvas"
import Home from "./pages/home"
import GameRoom from "./pages/gameRoom"

function App() {

  //TODO: generate a user id

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<GameRoom />} />
      </Routes>
    </>
  )
}

export default App
