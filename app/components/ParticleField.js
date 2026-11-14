"use client";
import { useRef, useEffect } from "react";

export default function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let animationId;
    let timerId;

    const startAnimation = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      let particles = [];

      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      resize();
      window.addEventListener("resize", resize, { passive: true });

      const isMobile = window.innerWidth < 768;
      const count = isMobile ? 15 : 40;

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          speedX: (Math.random() - 0.5) * 0.25,
          speedY: (Math.random() - 0.5) * 0.25,
          opacity: Math.random() * 0.3 + 0.1,
          pulse: Math.random() * Math.PI * 2,
        });
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p) => {
          p.x += p.speedX;
          p.y += p.speedY;
          p.pulse += 0.02;

          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;

          const currentOpacity = p.opacity * (0.5 + 0.5 * Math.sin(p.pulse));

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(232, 98, 44, ${currentOpacity})`;
          ctx.fill();
        });

        // Skip pairwise lines on mobile screens to preserve main-thread performance & TBT
        if (!isMobile) {
          particles.forEach((a, i) => {
            particles.slice(i + 1).forEach((b) => {
              const dist = Math.hypot(a.x - b.x, a.y - b.y);
              if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = `rgba(232, 98, 44, ${0.03 * (1 - dist / 120)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
              }
            });
          });
        }

        animationId = requestAnimationFrame(animate);
      };

      animate();
    };

    // Start on first interaction or after a 4s delay so initial paint & speed index are instantaneous
    const onUserInteract = () => {
      startAnimation();
      window.removeEventListener("scroll", onUserInteract);
      window.removeEventListener("mousemove", onUserInteract);
      window.removeEventListener("touchstart", onUserInteract);
    };

    window.addEventListener("scroll", onUserInteract, { passive: true });
    window.addEventListener("mousemove", onUserInteract, { passive: true, once: true });
    window.addEventListener("touchstart", onUserInteract, { passive: true, once: true });

    const fallbackTimer = setTimeout(startAnimation, 6000);

    return () => {
      clearTimeout(fallbackTimer);
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener("scroll", onUserInteract);
      window.removeEventListener("mousemove", onUserInteract);
      window.removeEventListener("touchstart", onUserInteract);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
      aria-hidden="true"
    />
  );
}
