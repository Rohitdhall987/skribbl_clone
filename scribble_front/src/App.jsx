import { Route, Routes } from "react-router-dom"
import "./App.css"
import Home from "./pages/home"
import GameRoom from "./pages/gameRoom"
import { useEffect } from "react"

function App() {

  //TODO: generate a user id
  useEffect(() => {
    getdata();
  }, []);

  async function getdata() {
    const res = await fetch("http://localhost:8000/");

    if (res.ok) {
      console.log(await res.text());
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
