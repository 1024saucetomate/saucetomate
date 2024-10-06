"use client";

import Matter from "matter-js";
import React, { useEffect, useRef } from "react";

interface MatterSceneProps {
  className?: string;
}

export default function MatterScene({ className }: Readonly<MatterSceneProps>) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);

  useEffect(() => {
    const {
      Engine,
      Render,
      Runner,
      Bodies,
      Composite,
      Mouse,
      MouseConstraint,
    } = Matter;

    engineRef.current = Engine.create();
    const world = engineRef.current.world;
    engineRef.current.gravity.y = 0.5;

    if (!sceneRef.current) return;

    const { clientWidth: width, clientHeight: height } = sceneRef.current;

    renderRef.current = Render.create({
      element: sceneRef.current,
      engine: engineRef.current,
      options: {
        width,
        height,
        wireframes: false,
        background: "var(--color-red)",
        pixelRatio: window.devicePixelRatio || 1,
      },
    });

    const images = ["/assets/donaldtrump.png", "/assets/kamalaharris.png"];
    const imageSizes = [
      { width: 727.36, height: 1000 },
      { width: 940.69, height: 1000 },
    ];
    const scale = 0.1;

    const createCircularImage = (x: number, y: number, imgIndex: number) => {
      const { width: imgWidth, height: imgHeight } = imageSizes[imgIndex];
      const scaledWidth = imgWidth * scale;
      const scaledHeight = imgHeight * scale;
      const radius = Math.max(scaledWidth, scaledHeight) / 2;

      return Bodies.circle(x, y, radius, {
        restitution: 0.5,
        friction: 0.5,
        frictionAir: 0.01,
        density: 0.5,
        frictionStatic: 0.5,
        render: {
          sprite: {
            texture: images[imgIndex],
            xScale: scale,
            yScale: scale,
          },
        },
        slop: 1,
      });
    };

    const generateImages = () => {
      const objectCount = Math.floor(width / 20) - Math.floor(height / 100);
      const objects = Array.from({ length: objectCount }, () => {
        const imgIndex = Math.floor(Math.random() * images.length);
        const imgSize = imageSizes[imgIndex];
        const imgWidth = imgSize.width * scale;
        const imgHeight = imgSize.height * scale;
        const x = Math.random() * (width - imgWidth) + imgWidth / 2;
        const y = Math.random() * (height - imgHeight) + imgHeight / 2;
        const img = createCircularImage(x, y, imgIndex);
        Matter.Body.rotate(img, Math.random() * Math.PI * 2);
        return img;
      });
      Composite.add(world, objects);
    };

    const createBoundaries = () => {
      const boundaries = [
        Bodies.rectangle(width / 2, height + 50, width * 2, 100, {
          isStatic: true,
        }),
        Bodies.rectangle(-50, height / 2, 100, height * 2, { isStatic: true }),
        Bodies.rectangle(width + 50, height / 2, 100, height * 2, {
          isStatic: true,
        }),
        Bodies.rectangle(width / 2, -50, width * 2, 100, { isStatic: true }),
      ];

      boundaries.forEach((boundary) => {
        boundary.render.visible = false;
      });

      Composite.add(world, boundaries);
      return boundaries;
    };

    const boundaries = createBoundaries();
    generateImages();

    const mouse = Mouse.create(renderRef.current.canvas);
    const mouseConstraint = MouseConstraint.create(engineRef.current, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });

    Composite.add(world, mouseConstraint);
    renderRef.current.mouse = mouse;

    Render.run(renderRef.current);
    Runner.run(Runner.create(), engineRef.current);

    const handleResize = () => {
      if (!sceneRef.current || !renderRef.current) return;
      const { clientWidth: newWidth, clientHeight: newHeight } =
        sceneRef.current;

      renderRef.current.canvas.width =
        newWidth * (window.devicePixelRatio || 1);
      renderRef.current.canvas.height =
        newHeight * (window.devicePixelRatio || 1);
      renderRef.current.canvas.style.width = `${newWidth}px`;
      renderRef.current.canvas.style.height = `${newHeight}px`;
      Render.setPixelRatio(renderRef.current, window.devicePixelRatio || 1);

      boundaries.forEach((boundary, index) => {
        const positions = [
          Matter.Vector.create(newWidth / 2, newHeight + 50),
          Matter.Vector.create(-50, newHeight / 2),
          Matter.Vector.create(newWidth + 50, newHeight / 2),
          Matter.Vector.create(newWidth / 2, -50),
        ];
        Matter.Body.setPosition(boundary, positions[index]);
      });

      Render.lookAt(renderRef.current, {
        min: { x: 0, y: 0 },
        max: { x: newWidth, y: newHeight },
      });
    };

    window.addEventListener("resize", handleResize);
    setTimeout(handleResize, 0);
  }, []);

  return <div ref={sceneRef} className={className} />;
}
