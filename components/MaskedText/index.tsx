import React, { useEffect, useRef, useState } from "react";

import styles from "@/styles/components/masked-text.module.css";

const MaskedText = ({
  text,
  maskedPart,
  className,
}: Readonly<{
  text: string;
  maskedPart: string;
  className?: string;
}>) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskedTextRef = useRef<HTMLSpanElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [textColor, setTextColor] = useState("rgb(0, 0, 0)");

  useEffect(() => {
    const updateCanvasSize = () => {
      if (maskedTextRef.current) {
        const { width, height } = maskedTextRef.current.getBoundingClientRect();
        setCanvasSize({
          width: width * window.devicePixelRatio,
          height: height * window.devicePixelRatio,
        });
      }
    };

    const updateTextColor = () => {
      if (maskedTextRef.current) {
        const computedStyle = window.getComputedStyle(maskedTextRef.current);
        setTextColor(computedStyle.color);
      }
    };

    window.addEventListener("resize", updateCanvasSize);

    setTimeout(() => {
      updateCanvasSize();
      updateTextColor();
    }, 100);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const particles: {
      x: number;
      y: number;
      radius: number;
      opacity: number;
      decay: number;
      vx: number;
      vy: number;
    }[] = [];

    const init = () => {
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;
    };

    const spawnParticle = () => {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: (0.5 * 1 + 0.5) * window.devicePixelRatio,
        opacity: 1,
        decay: Math.random() * 0.005 + 0.002,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      });
    };

    const getEdgeFactor = (x: number, y: number, canvasWidth: number, canvasHeight: number) => {
      const distToLeft = x;
      const distToRight = canvasWidth - x;
      const distToTop = y;
      const distToBottom = canvasHeight - y;
      const minDistToEdge = Math.min(distToLeft, distToRight, distToTop, distToBottom);
      const fadeThreshold = 5;
      const edgeFactor = Math.max(minDistToEdge / fadeThreshold, 0);
      return Math.min(edgeFactor, 1);
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        particle.opacity -= particle.decay;
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.opacity <= 0) {
          particles.splice(index, 1);
          spawnParticle();
        }

        const edgeFactor = getEdgeFactor(particle.x, particle.y, canvas.width, canvas.height);
        const finalOpacity = particle.opacity * edgeFactor;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = textColor.replace("rgb", "rgba").replace(")", `, ${finalOpacity})`);
        ctx.fill();
      });

      const maxParticles = (200 * canvas.width * canvas.height) / 10000;

      for (let i = particles.length; i < maxParticles; i++) {
        spawnParticle();
      }

      requestAnimationFrame(animate);
    };

    init();
    const animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [canvasSize, textColor]);

  if (typeof maskedPart !== "string" || !maskedPart) {
    return <span>{text}</span>;
  }

  const maskIndex = text.indexOf(maskedPart);

  return (
    <span className={`${styles.container} ${className}`}>
      {text.substring(0, maskIndex)}
      <span className={styles.container__content}>
        <span ref={maskedTextRef} className={styles.container__content__text}>
          {maskedPart}
        </span>
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className={styles.container__content__canvas}
          style={{
            width: canvasSize.width / window.devicePixelRatio,
            height: canvasSize.height / window.devicePixelRatio,
          }}
        />
      </span>
      {text.substring(maskIndex + maskedPart.length)}
    </span>
  );
};

export default MaskedText;
