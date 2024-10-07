"use client";

import Matter from "matter-js";
import React, { useEffect, useRef } from "react";

interface MatterEndingSceneProps {
  className?: string;
  candidate: string;
  start: boolean;
}

export default function MatterEndingScene({
  className,
  candidate,
  start,
}: Readonly<MatterEndingSceneProps>) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);

  useEffect(() => {
    const { Engine, Render, Runner, Bodies, Composite } = Matter;

    engineRef.current = Engine.create();
    const world = engineRef.current.world;
    engineRef.current.gravity.y = 1;

    if (!sceneRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    renderRef.current = Render.create({
      element: sceneRef.current,
      engine: engineRef.current,
      options: {
        width,
        height,
        wireframes: false,
        background: "transparent",
        pixelRatio: window.devicePixelRatio || 1,
      },
    });

    const image =
      candidate === "Donald Trump"
        ? "/assets/donaldtrump.png"
        : "/assets/kamalaharris.png";
    const imageSize =
      candidate === "Donald Trump"
        ? { width: 727.36, height: 1000 }
        : { width: 940.69, height: 1000 };
    const scale = 0.1;

    const createHead = (x: number, y: number) => {
      const scaledWidth = imageSize.width * scale;
      const scaledHeight = imageSize.height * scale;
      const radius = Math.max(scaledWidth, scaledHeight) / 2;

      return Bodies.circle(x, y, radius, {
        restitution: 0.5,
        friction: 0.5,
        frictionAir: 0.01,
        density: 0.5,
        frictionStatic: 0.5,
        render: {
          sprite: {
            texture: image,
            xScale: scale,
            yScale: scale,
          },
        },
        slop: 1,
      });
    };

    const generateHeads = () => {
      const heads = Array.from({ length: width * height * 0.00007 }, () => {
        const x = Math.random() * width;
        const y = -Math.random() * height * 3;
        const head = createHead(x, y);
        Matter.Body.rotate(head, Math.random() * Math.PI * 2);
        return head;
      });
      Composite.add(world, heads);
    };

    const wallThickness = 50;
    const ground = Bodies.rectangle(
      width / 2,
      height + wallThickness / 2,
      width,
      wallThickness,
      {
        isStatic: true,
        render: { fillStyle: "#000000" },
      },
    );
    const leftWall = Bodies.rectangle(
      -wallThickness / 2,
      height / 2,
      wallThickness,
      height * 2,
      {
        isStatic: true,
        render: { fillStyle: "#000000" },
      },
    );
    const rightWall = Bodies.rectangle(
      width + wallThickness / 2,
      height / 2,
      wallThickness,
      height * 2,
      {
        isStatic: true,
        render: { fillStyle: "#000000" },
      },
    );

    Composite.add(world, [ground, leftWall, rightWall]);

    Render.run(renderRef.current);
    const runner = Runner.create();

    const handleResize = () => {
      if (!renderRef.current) return;
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      renderRef.current.canvas.width =
        newWidth * (window.devicePixelRatio || 1);
      renderRef.current.canvas.height =
        newHeight * (window.devicePixelRatio || 1);
      renderRef.current.canvas.style.width = `${newWidth}px`;
      renderRef.current.canvas.style.height = `${newHeight}px`;
      Render.setPixelRatio(renderRef.current, window.devicePixelRatio || 1);

      Matter.Body.setPosition(ground, {
        x: newWidth / 2,
        y: newHeight + wallThickness / 2,
      });
      Matter.Body.setPosition(leftWall, {
        x: -wallThickness / 2,
        y: newHeight / 2,
      });
      Matter.Body.setPosition(rightWall, {
        x: newWidth + wallThickness / 2,
        y: newHeight / 2,
      });

      Render.lookAt(renderRef.current, {
        min: { x: 0, y: 0 },
        max: { x: newWidth, y: newHeight },
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    if (start) {
      generateHeads();
      Runner.run(runner, engineRef.current);
    }
  }, [candidate, start]);

  return (
    <div
      ref={sceneRef}
      className={className}
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
