import React, { useEffect, useRef } from 'react';

export const MatrixClothBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const spacing = 30;

    interface Point {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      vx: number;
      vy: number;
    }

    const initPoints = (w: number, h: number) => {
      const r = Math.ceil(h / spacing) + 1;
      const c = Math.ceil(w / spacing) + 1;
      const newPoints: Point[] = [];
      for (let y = 0; y < r; y++) {
        for (let x = 0; x < c; x++) {
          newPoints.push({
            x: x * spacing,
            y: y * spacing,
            baseX: x * spacing,
            baseY: y * spacing,
            vx: 0,
            vy: 0,
          });
        }
      }
      return { newPoints, r, c };
    };

    let { newPoints: points, r: rows, c: cols } = initPoints(width, height);

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 150,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      const result = initPoints(width, height);
      points = result.newPoints;
      rows = result.r;
      cols = result.c;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    handleResize();

    const animate = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(79, 70, 229, 0.15)';
      ctx.lineWidth = 0.5;

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        
        // Idle movement (wave effect)
        const idleX = Math.sin(time * 0.001 + p.baseY * 0.01) * 5;
        const idleY = Math.cos(time * 0.001 + p.baseX * 0.01) * 5;

        // Distance from mouse
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          const tx = p.x - Math.cos(angle) * force * 60;
          const ty = p.y - Math.sin(angle) * force * 60;
          
          p.vx += (tx - p.x) * 0.15;
          p.vy += (ty - p.y) * 0.15;
        }

        // Return to base position + idle movement
        p.vx += (p.baseX + idleX - p.x) * 0.04;
        p.vy += (p.baseY + idleY - p.y) * 0.04;

        // Friction
        p.vx *= 0.92;
        p.vy *= 0.92;

        p.x += p.vx;
        p.y += p.vy;

        // Draw lines to neighbors
        const x = i % cols;
        const y = Math.floor(i / cols);

        if (x < cols - 1) {
          const right = points[i + 1];
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(right.x, right.y);
        }
        if (y < rows - 1) {
          const down = points[i + cols];
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(down.x, down.y);
        }
      }
      ctx.stroke();

      // Draw small dots at junctions with varying opacity based on movement
      for (const p of points) {
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const opacity = 0.1 + Math.min(speed * 0.2, 0.4);
        ctx.fillStyle = `rgba(79, 70, 229, ${opacity})`;
        ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
      style={{ zIndex: 0 }}
    />
  );
};
