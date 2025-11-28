import { useEffect, useRef } from "react";

export default function MagicToast({ message, visible }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!visible) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const particles = [];
    const w = (canvas.width = window.innerWidth);
    const h = (canvas.height = 120);

    const createParticle = () => {
      const x = w / 2;
      const y = h / 2;
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2;
      const size = 1 + Math.random() * 3;

      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed * 0.7,
        size,
        alpha: 1
      });
    };

    for (let i = 0; i < 60; i++) createParticle();

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.01;

        ctx.fillStyle = `rgba(255, 215, 0, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.alpha <= 0) particles.splice(i, 1);
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, [visible]);

  return (
    <div
      className={`fixed left-1/2 bottom-6 transform -translate-x-1/2 transition-all duration-500 
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
      style={{ zIndex: 9999 }}
    >
      <canvas ref={canvasRef} className="w-screen h-[120px] absolute left-0 bottom-0"></canvas>

      <div
        className="relative px-6 py-3 text-white font-bold text-lg
        backdrop-blur-md rounded-xl shadow-lg border border-yellow-300/30"
        style={{
          background: "rgba(255, 255, 255, 0.15)",
        }}
      >
        {message}
      </div>
    </div>
  );
}
