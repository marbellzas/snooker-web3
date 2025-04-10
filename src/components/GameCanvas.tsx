import { useEffect, useRef } from "react";

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ball = useRef({ x: 400, y: 200, dx: 0, dy: 0 });

  const update = () => {
    const b = ball.current;
    b.x += b.dx;
    b.y += b.dy;
    b.dx *= 0.98;
    b.dy *= 0.98;

    if (Math.abs(b.dx) < 0.1) b.dx = 0;
    if (Math.abs(b.dy) < 0.1) b.dy = 0;

    if (b.x <= 10 || b.x >= 790) b.dx *= -1;
    if (b.y <= 10 || b.y >= 390) b.dy *= -1;

    b.x = Math.max(10, Math.min(790, b.x));
    b.y = Math.max(10, Math.min(390, b.y));
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    const b = ball.current;
    ctx.clearRect(0, 0, 800, 400);
    ctx.fillStyle = "#1a3b1f";
    ctx.fillRect(0, 0, 800, 400);
    ctx.beginPath();
    ctx.arc(b.x, b.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    let animationId: number;

    const loop = () => {
      update();
      if (ctx) draw(ctx);
      animationId = requestAnimationFrame(loop);
    };
    loop();

    return () => cancelAnimationFrame(animationId);
  }, []);

  const shoot = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const b = ball.current;
    const angle = Math.atan2(b.y - y, b.x - x);
    const power = 6;
    b.dx = Math.cos(angle) * power;
    b.dy = Math.sin(angle) * power;
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={400}
      onClick={shoot}
      className="rounded-2xl border-4 border-yellow-300 shadow-xl"
    />
  );
}
