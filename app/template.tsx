"use client";
import { motion } from "framer-motion";
import React from "react";

const variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
};

export default function Template({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <motion.main
      variants={variants}
      initial="hidden"
      exit="hidden"
      animate="enter"
      transition={{ type: "easeInOut", duration: 0.75 }}
      key="WebApp"
    >
      {children}
    </motion.main>
  );
}
