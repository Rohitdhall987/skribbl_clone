import "./game_canvas.css"
import { useRef, useState, useEffect } from "react"

function GameCanvas() {


  const colorRef = useRef("#FF0000");
  const [color, setColorState] = useState("#FF0000");
  const [strokeWidth, setStrokeWidth] = useState(5);

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    ctxRef.current = ctx;

    ctxRef.current.lineWidth = strokeWidth;


    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("mousedown", handleMouseDown);

    return () => {
      canvas.removeEventListener("mousemove", handleMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);


  const updateStroke = (e) => {
    const value = Number(e.target.value);
    setStrokeWidth(value);
    ctxRef.current.lineWidth = value;
  }

  const upddateColor = (e) => {
    setColorState(e.target.value);
    colorRef.current = e.target.value;
  };

  const handleMouseDown = (e) => {
    const ctx = ctxRef.current;
    const x = e.offsetX;
    const y = e.offsetY;

    ctx.fillStyle = colorRef.current;
    ctx.strokeStyle = colorRef.current;

    ctx.beginPath();
    ctx.arc(x, y, ctx.lineWidth / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);

    lastXRef.current = e.offsetX;
    lastYRef.current = e.offsetY;
  };

  const handleMove = (e) => {
    if (e.buttons !== 1) return;

    const x = e.offsetX;
    const y = e.offsetY;

    const ctx = ctxRef.current;


    ctx.lineTo(x, y);
    ctx.stroke();

    lastXRef.current = x;
    lastYRef.current = y;
  };


  const clearCanvas = (_) => {
    const ctx = ctxRef.current;
    ctx.reset();
    ctx.lineWidth = strokeWidth;
  }


  return (
    <>
      <div className="canvas_container">
        <canvas className="drawing_area" ref={canvasRef}></canvas>
        <input type="range" max="19" min="1" step="1" value={strokeWidth} onChange={updateStroke} />
        <input type="color" value={color} onChange={upddateColor} />
        <input type="button" onClick={clearCanvas} value="Clear All" />
      </div>
    </>
  )
}
export default GameCanvas
