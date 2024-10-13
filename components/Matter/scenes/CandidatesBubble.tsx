"use client";

import Matter from "matter-js";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import MockAPI from "@/utils/MockAPI";

export default function MatterScene__CandidatesBubble({
  className,
}: Readonly<{
  className?: string;
}>) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const [candidates, setCandidates] = useState<{ image: { src: string; width: number; height: number } }[]>([]);

  useEffect(() => {
    setCandidates(MockAPI.get.candidates());
  }, []);

  useLayoutEffect(() => {
    if (candidates.length === 0) return;

    const { Engine, Render, Bodies, Body, Composite, Runner, Mouse, MouseConstraint, Vector } = Matter;

    engineRef.current = Engine.create();
    engineRef.current.gravity.y = 0.5;

    if (!sceneRef.current) return;

    const { clientWidth, clientHeight } = sceneRef.current;

    renderRef.current = Render.create({
      element: sceneRef.current,
      engine: engineRef.current,
      options: {
        width: clientWidth,
        height: clientHeight,
        wireframes: false,
        background: "var(--color-red)",
        pixelRatio: window.devicePixelRatio || 1,
      },
    });

    const images = candidates.map((candidate) => candidate.image);

    function createCircularImage(x: number, y: number, index: number) {
      const image = images[index];
      const radius = Math.max(image.width * 0.2, image.height * 0.2) / 2;

      return Bodies.circle(x, y, radius, {
        restitution: 0.5,
        friction: 0.5,
        frictionAir: 0.01,
        density: 0.5,
        frictionStatic: 0.5,
        slop: 1,
        render: {
          sprite: {
            texture: image.src,
            xScale: 0.2,
            yScale: 0.2,
          },
        },
      });
    }

    function generateImages() {
      if (!engineRef.current) return;
      const objectCount = clientWidth * clientHeight * 0.00005;
      const objects = Array.from({ length: objectCount }, () => {
        const x = Math.random() * clientWidth;
        const y = Math.random() * clientHeight;
        const index = Math.floor(Math.random() * images.length);

        const object = createCircularImage(x, y, index);
        Body.rotate(object, Math.random() * Math.PI * 2);
        return object;
      });
      Composite.add(engineRef.current.world, objects);
    }

    function createBoundaries() {
      if (!engineRef.current) return;
      const boundaries = [
        Bodies.rectangle(clientWidth / 2, clientHeight + 50, clientWidth * 2, 100, { isStatic: true }),
        Bodies.rectangle(-50, clientHeight / 2, 100, clientHeight * 2, { isStatic: true }),
        Bodies.rectangle(clientWidth + 50, clientHeight / 2, 100, clientHeight * 2, { isStatic: true }),
        Bodies.rectangle(clientWidth / 2, -50, clientWidth * 2, 100, { isStatic: true }),
      ];

      boundaries.forEach((boundary) => {
        boundary.render.visible = false;
      });

      Composite.add(engineRef.current.world, boundaries);
      return boundaries;
    }

    const boundaries = createBoundaries();
    generateImages();

    const mouse = Mouse.create(renderRef.current.canvas);
    const mouseConstraint = MouseConstraint.create(engineRef.current, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });
    Composite.add(engineRef.current.world, mouseConstraint);
    renderRef.current.mouse = mouse;

    Render.run(renderRef.current);
    Runner.run(Runner.create(), engineRef.current);

    function handleResize() {
      if (!sceneRef.current || !renderRef.current) return;
      const { clientWidth: newClientWidth, clientHeight: newClientHeight } = sceneRef.current;
      renderRef.current.canvas.width = newClientWidth * (window.devicePixelRatio || 1);
      renderRef.current.canvas.height = newClientHeight * (window.devicePixelRatio || 1);
      renderRef.current.canvas.style.width = `${newClientWidth}px`;
      renderRef.current.canvas.style.height = `${newClientHeight}px`;
      Render.setPixelRatio(renderRef.current, window.devicePixelRatio || 1);

      boundaries?.forEach((boundary, index) => {
        const positions = [
          Vector.create(newClientWidth / 2, newClientHeight + 50),
          Vector.create(-50, newClientHeight / 2),
          Vector.create(newClientWidth + 50, newClientHeight / 2),
          Vector.create(newClientWidth / 2, -50),
        ];
        Body.setPosition(boundary, positions[index]);
      });
    }

    window.addEventListener("resize", handleResize);
  }, [candidates]);

  return <div className={className} ref={sceneRef} />;
}
