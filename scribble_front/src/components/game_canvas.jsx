import { IoBrush } from "react-icons/io5";
import "./game_canvas.css"
import { useRef, useState, useEffect } from "react"
import { FaFillDrip, FaRegTrashCan } from "react-icons/fa6";

function GameCanvas({ isDrawing, onDrawEnd }) {


  const colorRef = useRef("#FF0000");
  const toolRef = useRef(0);
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [activeColor, setActiveColor] = useState("#FF0000");
  const [tool, setToolState] = useState(0);

  const quickColors = [
    "#FF0000", // red
    "#00FF00", // green
    "#0000FF", // blue
    "#FFFF00", // yellow
    "#FF00FF", // magenta
    "#00FFFF", // cyan
    "#000000", // black
    "#FFFFFF", // white
    "#FFA500", // orange
    "#800080"  // purple
  ];


  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctxRef.current = ctx;

    ctxRef.current.lineWidth = strokeWidth;


    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("mousedown", handleMouseDown);

    return () => {
      canvas.removeEventListener("mousemove", handleMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  const updateTool = (val) => {
    setToolState(val);
    toolRef.current = val;
  }

  const updateStroke = (e) => {
    const value = Number(e.target.value);
    setStrokeWidth(value);
    ctxRef.current.lineWidth = value;
  }

  const upddateColor = (color) => {
    setActiveColor(color);
    colorRef.current = color;
  };

  const handleMouseDown = (e) => {
    const ctx = ctxRef.current;

    const x = e.offsetX;
    const y = e.offsetY;

    ctx.fillStyle = colorRef.current;
    ctx.strokeStyle = colorRef.current;

    if (toolRef.current == 1) {

      const width = canvasRef.current.width;
      const height = canvasRef.current.height;

      fillArea(ctx, x, y, width, height);
      return;
    }

    setUpBrushStart(ctx, x, y);
  };

  const setUpBrushStart = (ctx, x, y) => {
    if (!isDrawing) return;

    ctx.beginPath();
    ctx.arc(x, y, ctx.lineWidth / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x, y);


  }

  const handleMove = (e) => {
    if (!isDrawing) return;
    if (e.buttons !== 1 || toolRef.current == 1) return;

    const x = e.offsetX;
    const y = e.offsetY;

    const ctx = ctxRef.current;


    ctx.lineTo(x, y);
    ctx.stroke();

  };


  const clearCanvas = (_) => {
    const ctx = ctxRef.current;
    ctx.fillStyle = "white";
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    ctx.fillRect(0, 0, w, h);
    ctx.lineWidth = strokeWidth;
  };

  const fillArea = (ctx, startX, startY, width, height) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const targetColor = getColorAtPixel(data, startX, startY, width);
    const fillColor = hexToRGBA(colorRef.current);

    if (colorsMatch(targetColor, fillColor)) return;


    const stack = [[startX, startY]];

    while (stack.length) {
      const [x, y] = stack.pop();

      if (x < 0 || y < 0 || x >= width || y >= height) continue;

      const currentColor = getColorAtPixel(data, x, y, width);

      if (!colorsMatch(currentColor, targetColor)) continue;

      setPixel(data, x, y, width, fillColor);

      stack.push([x + 1, y]);
      stack.push([x - 1, y]);
      stack.push([x, y + 1]);
      stack.push([x, y - 1]);
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const getColorAtPixel = (data, x, y, width) => {
    const index = (y * width + x) * 4;
    return [
      data[index],
      data[index + 1],
      data[index + 2],
      data[index + 3],
    ];
  };

  const colorsMatch = (a, b) => {
    return a[0] === b[0] &&
      a[1] === b[1] &&
      a[2] === b[2] &&
      a[3] === b[3];
  };

  const setPixel = (data, x, y, width, color) => {
    const index = (y * width + x) * 4;
    data[index] = color[0];
    data[index + 1] = color[1];
    data[index + 2] = color[2];
    data[index + 3] = 255;
  };
  const hexToRGBA = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b, 255];
  };


  return (
    <>
      <div className="canvas_container">
        <canvas className="drawing_area" ref={canvasRef}></canvas>
        {
          isDrawing &&
          <div className="flex mt-4 gap-4 justify-end items-center">
            <div className=" grid grid-cols-10">
              {
                quickColors.map((color, i) => (
                  <button key={i} className={"color " + (color == activeColor ? "active_color" : "")} style={{ "backgroundColor": color }} onClick={(_) => upddateColor(color)}></button>
                ))
              }
            </div>


            <div className="flex gap-4">
              <input type="range" max="19" min="1" step="1" value={strokeWidth} onChange={updateStroke} />
              <button className={tool == 0 ? "btn_secondary" : ""} onClick={(_) => updateTool(0)} >
                <IoBrush />
              </button>
              <button className={tool == 1 ? "btn_secondary" : ""} onClick={(_) => updateTool(1)} >
                <FaFillDrip />
              </button>

              <button onClick={clearCanvas} className="btn_primary">
                <FaRegTrashCan />
              </button>
            </div>

          </div>
        }
      </div >
    </>
  )
}
export default GameCanvas
