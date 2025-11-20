import { useEffect, useRef } from "react";

export default function DustParticles({ className }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const baseParticles = 80;
    const screenMultiplier = window.innerWidth < 768 ? 0.5 : 1;
    const particleCount = Math.floor(baseParticles * screenMultiplier);

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.4 + 0.2,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: (Math.random() - 0.5) * 0.2,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 1.5);
      gradient.addColorStop(0, "rgb(80, 60, 40)");
      gradient.addColorStop(1, "rgb(30, 20, 10)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 240, 200, ${p.alpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
  <canvas
    ref={canvasRef}
    className={`pointer-events-none ${className}`}
  />
);

}

