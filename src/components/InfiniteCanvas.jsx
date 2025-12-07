import React, { useRef, useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function InfiniteCanvasMobile() {
  const navigate = useNavigate();

  const CANVAS_W = 300;
  const CANVAS_H = 300;

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#00eaff");
  const [lineWidth, setLineWidth] = useState(4);

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const pointers = useRef(new Map());
  const lastDistance = useRef(null);
  const currentLineRef = useRef(null);

  // Canvas 初始化
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    canvas.width = CANVAS_W * dpr;
    canvas.height = CANVAS_H * dpr;
    canvas.style.width = `${CANVAS_W}px`;
    canvas.style.height = `${CANVAS_H}px`;

    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctxRef.current = ctx;
  }, []);

  const canvasStyleTransform = {
    transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
    transformOrigin: "center center",
  };

  const getCanvasPos = (clientX, clientY) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    return {
      x: (clientX - rect.left - offset.x) / zoom,
      y: (clientY - rect.top - offset.y) / zoom,
    };
  };

  /* ======= PointerDown ======= */
  const handlePointerDown = (e) => {
    canvasRef.current.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 1) {
      const pos = getCanvasPos(e.clientX, e.clientY);
      currentLineRef.current = {
        tool,
        color,
        width: lineWidth,
        points: [pos],
      };
    }

    if (pointers.current.size === 2) {
      const arr = [...pointers.current.values()];
      lastDistance.current = Math.hypot(
        arr[0].x - arr[1].x,
        arr[0].y - arr[1].y
      );
    }
  };

  /* ======= PointerMove ======= */
  const handlePointerMove = (e) => {
    if (!pointers.current.has(e.pointerId)) return;

    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...pointers.current.values()];

    // 雙指：移動 + 縮放
    if (pts.length === 2) {
      const [p1, p2] = pts;

      const cx = (p1.x + p2.x) / 2;
      const cy = (p1.y + p2.y) / 2;

      const prev = pointers.current.prevCenter || { x: cx, y: cy };
      pointers.current.prevCenter = { x: cx, y: cy };

      setOffset((prevOffset) => ({
        x: prevOffset.x + (cx - prev.x),
        y: prevOffset.y + (cy - prev.y),
      }));

      const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      if (lastDistance.current && dist) {
        const zoomChange = dist / lastDistance.current;
        setZoom((z) => Math.min(Math.max(z * zoomChange, 0.3), 3));
      }
      lastDistance.current = dist;

      return;
    }

    // 單指：畫畫
    if (pts.length === 1 && currentLineRef.current) {
      const pos = getCanvasPos(e.clientX, e.clientY);
      const arr = currentLineRef.current.points;
      arr.push(pos);

      const ctx = ctxRef.current;
      const last = arr[arr.length - 2];

      ctx.beginPath();
      ctx.moveTo(last.x, last.y);

      if (currentLineRef.current.tool === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = "rgba(0,0,0,1)";
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = currentLineRef.current.color;
      }

      ctx.lineWidth = currentLineRef.current.width / zoom;
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.globalCompositeOperation = "source-over";
    }
  };

  const handlePointerUp = () => {
    pointers.current.clear();
    pointers.current.prevCenter = null;
    lastDistance.current = null;
    currentLineRef.current = null;
  };

  /* ======= 清空畫布 ======= */
  const clearCanvas = () => {
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  };

  /* ======= 上傳功能 ======= */
  const uploadWhiteboard = async () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");

    try {
      await addDoc(collection(db, "boards"), {
        imageBase64: dataURL,
        createdAt: serverTimestamp(),
      });

      alert("📤 已上傳到 Firestore！");
      navigate("/gallery");
    } catch (err) {
      console.error("上傳錯誤:", err);
      alert("❌ 上傳失敗！");
    }
  };

  return (
    <div className="relative w-full h-screen bg-black/5 overflow-hidden touch-none select-none p-4">

      {/* ====== 工具列（RWD 改好） ====== */}
      <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 mb-4 justify-center">

        <button
          onClick={() => setTool("pen")}
          className={`neon-btn text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3 ${
            tool === "pen" ? "active" : ""
          }`}
        >
          ✏️ 筆刷
        </button>

        <button
          onClick={() => setTool("eraser")}
          className={`neon-btn text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3 ${
            tool === "eraser" ? "active" : ""
          }`}
        >
          🧽 橡皮擦
        </button>

        <input
          type="color"
          className="color-picker w-10 h-10 sm:w-12 sm:h-12"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />

        <input
          type="range"
          min="1"
          max="30"
          value={lineWidth}
          onChange={(e) => setLineWidth(Number(e.target.value))}
          className="w-28 sm:w-36"
        />
      </div>

      {/* ====== 畫布置中 ====== */}
      <div className="w-full flex justify-center items-center overflow-hidden">
        <canvas
          ref={canvasRef}
          style={{
            background: "white",
            border: "1px solid #ccc",
            touchAction: "none",
            ...canvasStyleTransform,
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>

      {/* ====== 下方按鈕（RWD 完整版） ====== */}
      <div className="mt-4 w-full flex flex-col items-center">

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
          <button
            className="neon-btn neon-red text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3"
            onClick={clearCanvas}
          >
            🗑 清空
          </button>

          <button
            className="neon-btn neon-green text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3"
            onClick={uploadWhiteboard}
          >
            📤 上傳
          </button>
        </div>

        <p className="mt-3 text-center text-sm text-gray-600">
          ✨ 畫完記得按下「上傳」喔！
        </p>
      </div>

    </div>
  );
}








