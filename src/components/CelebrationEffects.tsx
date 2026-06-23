import { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
};

const COLORS = ['#009b3a', '#0057b8', '#ffdf00', '#ffffff'];

function createBurst(width: number, height: number) {
  const originX = width * (0.18 + Math.random() * 0.64);
  const originY = height * (0.18 + Math.random() * 0.34);
  const particles: Particle[] = [];

  for (let index = 0; index < 72; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.5 + Math.random() * 4.8;
    const life = 54 + Math.random() * 32;

    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life,
      maxLife: life,
      size: 1.4 + Math.random() * 2.6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
  }

  return particles;
}

export function CelebrationEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    let animationFrame = 0;
    let lastBurst = 0;
    let particles: Particle[] = [];
    const startedAt = performance.now();

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const render = (time: number) => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = 'lighter';

      if (time - lastBurst > 360 && time - startedAt < 2900) {
        particles = particles.concat(createBurst(width, height));
        lastBurst = time;
      }

      particles = particles
        .map((particle) => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vx: particle.vx * 0.986,
          vy: particle.vy * 0.986 + 0.035,
          life: particle.life - 1,
        }))
        .filter((particle) => particle.life > 0);

      for (const particle of particles) {
        const alpha = Math.max(particle.life / particle.maxLife, 0);
        context.globalAlpha = alpha;
        context.fillStyle = particle.color;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      }

      context.globalAlpha = 1;
      context.globalCompositeOperation = 'source-over';
      animationFrame = window.requestAnimationFrame(render);
    };

    resize();
    particles = createBurst(window.innerWidth, window.innerHeight);
    animationFrame = window.requestAnimationFrame(render);
    window.addEventListener('resize', resize);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="celebration" aria-live="polite">
      <canvas ref={canvasRef} className="fireworks-canvas" />
      <div className="football-rain" aria-hidden="true">
        {Array.from({ length: 16 }, (_, index) => (
          <span key={index} style={{ '--ball-index': index } as React.CSSProperties}>
            ⚽
          </span>
        ))}
      </div>
      <h2>É HEXA CARAI!!</h2>
    </div>
  );
}
