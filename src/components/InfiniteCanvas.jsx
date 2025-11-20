import React, { useRef, useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";   // ★ 新增

export default function InfiniteCanvasMobile() {
  const navigate = useNavigate();   // ★ 新增

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

    const x = (clientX - rect.left - offset.x) / zoom;
    const y = (clientY - rect.top - offset.y) / zoom;

    return { x, y };
  };

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

  const handlePointerMove = (e) => {
    if (!pointers.current.has(e.pointerId)) return;

    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...pointers.current.values()];

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

  const clearCanvas = () => {
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  };

  /** ★★★ 加入 navigate("/gallery") 的上傳功能 ★★★ */
  const uploadWhiteboard = async () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");

    try {
      await addDoc(collection(db, "boards"), {
        imageBase64: dataURL,
        createdAt: serverTimestamp(),
      });

      alert("📤 已上傳到 Firestore！");
      navigate("/gallery");    // ←←← 自動跳轉展示牆
    } catch (err) {
      console.error("上傳錯誤:", err);
      alert("❌ 上傳失敗！");
    }
  };

  return (
    <div className="relative w-full h-screen bg-black/5 overflow-hidden touch-none select-none p-4">
      {/* 工具列 */}
      <div className="flex flex-wrap gap-2 mb-4 md:justify-center">
        <button
  onClick={() => setTool("pen")}
  className={`neon-btn ${tool === "pen" ? "active" : ""}`}
>
  ✏️ 筆刷
</button>

        <button
  onClick={() => setTool("eraser")}
  className={`neon-btn ${tool === "eraser" ? "active" : ""}`}
>
  🧽 橡皮擦
</button>

        <input
  type="color"
  className="color-picker"
  value={color}
  onChange={(e) => setColor(e.target.value)}
/>

        <input
          type="range"
          min="1"
          max="30"
          value={lineWidth}
          onChange={(e) => setLineWidth(Number(e.target.value))}
          className="w-28"
        />

       <button className="neon-btn neon-red" onClick={clearCanvas}>
  🗑 清空
</button>


        <button className="neon-btn neon-green" onClick={uploadWhiteboard}>
  📤 上傳
</button>
      </div>

       <div className="w-full h-[calc(100%-70px)] flex justify-center items-center overflow-hidden mt-5">
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
    </div>
  );
}







