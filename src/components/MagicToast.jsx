// MagicToast.jsx
import { useEffect, useRef } from "react";

export default function MagicToast({ message, visible }) {
  const canvasRef = useRef(null);

  // 粒子初始化
  useEffect(() => {
    if (!visible) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    canvas.width = window.innerWidth;
    canvas.height = 100; // 提示框高度

    const particles = Array.from({ length: 50 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedY: Math.random() * -1 - 0.5,
      alpha: Math.random()
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 粒子
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 215, 0, ${p.alpha})`; // 金色
        ctx.fill();
        p.y += p.speedY;
        p.alpha -= 0.01;
        if (p.alpha <= 0) {
          p.x = Math.random() * canvas.width;
          p.y = canvas.height;
          p.alpha = Math.random();
          p.speedY = Math.random() * -1 - 0.5;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrameId);
  }, [visible]);

  return (
    <div
      className={`fixed bottom-10 left-0 w-full flex justify-center pointer-events-none transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
      style={{ zIndex: 9999 }}
    >
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full"></canvas>
      <div
        style={{
          fontFamily: '"ZCOOL QingKe HuangYou", "Noto Sans TC", sans-serif',
          fontSize: "20px",
          fontWeight: "900",
          color: "#FFFFFF",  // 比原本金色更柔和
        //   opacity: 0.6,  // 透明度
          whiteSpace: "nowrap" // 單行不換行
        }}
      >
        {message}
      </div>
    </div>
  );
}
