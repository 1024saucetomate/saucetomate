import Matter from "matter-js";
import React, { useEffect, useRef } from "react";

export default function MatterScene({
  className,
}: Readonly<{ className?: string }>) {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);

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

    const render = Render.create({
      element: sceneRef.current,
      engine: engineRef.current,
      options: {
        width,
        height,
        wireframes: false,
        background: "transparent",
      },
    });

    const images = ["/assets/donaldtrump.png", "/assets/kamalaharris.png"];

    const imageSizes = [
      { width: 727.36, height: 1000 },
      { width: 940.69, height: 1000 },
    ];

    const scale = 0.1;

    const createCircularImage = (x: number, y: number, imgIndex: number) => {
      const width = imageSizes[imgIndex].width * scale;
      const height = imageSizes[imgIndex].height * scale;
      const radius = Math.max(width, height) / 2;

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
      const objectCount = Math.floor(width / 20);
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

    const boundaries = [
      Bodies.rectangle(width / 2, height, width, 1, { isStatic: true }),
      Bodies.rectangle(0, height / 2, 1, height, { isStatic: true }),
      Bodies.rectangle(width, height / 2, 1, height, { isStatic: true }),
      Bodies.rectangle(width / 2, 0, width, 1, { isStatic: true }),
    ];

    boundaries.forEach((boundary) => {
      boundary.render.visible = false;
    });

    Composite.add(world, boundaries);

    generateImages();

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engineRef.current, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });

    Composite.add(world, mouseConstraint);
    render.mouse = mouse;

    Render.run(render);
    Runner.run(Runner.create(), engineRef.current);

    const handleResize = () => {
      if (!sceneRef.current) return;
      const { clientWidth: newWidth, clientHeight: newHeight } =
        sceneRef.current;
      render.canvas.width = newWidth;
      render.canvas.height = newHeight;
      boundaries.forEach((boundary, index) => {
        switch (index) {
          case 0:
            Matter.Body.setPosition(
              boundary,
              Matter.Vector.create(newWidth / 2, newHeight),
            );
            break;
          case 1:
            Matter.Body.setPosition(
              boundary,
              Matter.Vector.create(0, newHeight / 2),
            );
            break;
          case 2:
            Matter.Body.setPosition(
              boundary,
              Matter.Vector.create(newWidth, newHeight / 2),
            );
            break;
          case 3:
            Matter.Body.setPosition(
              boundary,
              Matter.Vector.create(newWidth / 2, 0),
            );
            break;
        }
      });
    };

    window.addEventListener("resize", handleResize);
  }, []);

  return <div ref={sceneRef} className={className} />;
}
