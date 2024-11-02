"use client";

import Matter from "matter-js";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import type { CandidateImage, CandidatesBubbleProps } from "@/utils/interfaces";
import MockAPI from "@/utils/MockAPI";

const CandidatesBubble = ({ className }: CandidatesBubbleProps): JSX.Element => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const [candidates, setCandidates] = useState<CandidateImage[]>([]);

  useEffect(() => {
    setCandidates(MockAPI.get.candidates.all());
  }, []);

  const createCircularImage = (x: number, y: number, index: number, images: CandidateImage["image"][]) => {
    const image = images[index];
    const radius = Math.max(image.width * 0.2, image.height * 0.2) / 2;

    return Matter.Bodies.circle(x, y, radius, {
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
  };

  const generateImages = useCallback((clientWidth: number, clientHeight: number, images: CandidateImage["image"][]) => {
    if (!engineRef.current) return;
    const objectCount = clientWidth * clientHeight * 0.00005;

    const objects = Array.from({ length: objectCount }, () => {
      const x = Math.random() * clientWidth;
      const y = Math.random() * clientHeight;
      const index = Math.floor(Math.random() * images.length);
      const object = createCircularImage(x, y, index, images);
      Matter.Body.rotate(object, Math.random() * Math.PI * 2);
      return object;
    });

    Matter.Composite.add(engineRef.current.world, objects);
  }, []);

  const createBoundaries = (clientWidth: number, clientHeight: number) => {
    if (!engineRef.current) return;

    const boundaries = [
      Matter.Bodies.rectangle(clientWidth / 2, clientHeight + 50, clientWidth * 2, 100, { isStatic: true }),
      Matter.Bodies.rectangle(-50, clientHeight / 2, 100, clientHeight * 2, { isStatic: true }),
      Matter.Bodies.rectangle(clientWidth + 50, clientHeight / 2, 100, clientHeight * 2, { isStatic: true }),
      Matter.Bodies.rectangle(clientWidth / 2, -50, clientWidth * 2, 100, { isStatic: true }),
    ];

    boundaries.forEach((boundary) => {
      boundary.render.visible = false;
    });

    Matter.Composite.add(engineRef.current.world, boundaries);
    return boundaries;
  };

  useLayoutEffect(() => {
    if (candidates.length === 0 || !sceneRef.current) return;

    const { clientWidth, clientHeight } = sceneRef.current;
    const images = candidates.map((candidate) => candidate.image);

    engineRef.current = Matter.Engine.create();
    engineRef.current.gravity.y = 0.5;

    renderRef.current = Matter.Render.create({
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

    const boundaries = createBoundaries(clientWidth, clientHeight);
    generateImages(clientWidth, clientHeight, images);

    const mouse = Matter.Mouse.create(renderRef.current.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engineRef.current, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });

    Matter.Composite.add(engineRef.current.world, mouseConstraint);
    renderRef.current.mouse = mouse;

    Matter.Render.run(renderRef.current);
    Matter.Runner.run(Matter.Runner.create(), engineRef.current);

    const handleResize = () => {
      if (!sceneRef.current || !renderRef.current) return;
      const { clientWidth: newWidth, clientHeight: newHeight } = sceneRef.current;
      const pixelRatio = window.devicePixelRatio || 1;

      renderRef.current.canvas.width = newWidth * pixelRatio;
      renderRef.current.canvas.height = newHeight * pixelRatio;
      renderRef.current.canvas.style.width = `${newWidth}px`;
      renderRef.current.canvas.style.height = `${newHeight}px`;
      Matter.Render.setPixelRatio(renderRef.current, pixelRatio);

      boundaries?.forEach((boundary, index) => {
        const positions = [
          Matter.Vector.create(newWidth / 2, newHeight + 50),
          Matter.Vector.create(-50, newHeight / 2),
          Matter.Vector.create(newWidth + 50, newHeight / 2),
          Matter.Vector.create(newWidth / 2, -50),
        ];
        Matter.Body.setPosition(boundary, positions[index]);
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [candidates, generateImages]);

  return <div className={className} ref={sceneRef} />;
};

export default CandidatesBubble;
