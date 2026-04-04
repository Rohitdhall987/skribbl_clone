import { Route, Routes } from "react-router-dom"
import "./App.css"
import Home from "./pages/home"
import GameRoom from "./pages/gameRoom"
import { useEffect } from "react"

function App() {

  useEffect(() => {
    generateId();
  }, []);

  function generateId() {
    var id;
    id = localStorage.getItem("id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("id", id);
    }
  }

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
