"use client";
import { motion, useScroll } from "framer-motion";
import React, { useRef } from "react";

function Scroll() {
  const ref = useRef<HTMLDivElement>(null);

  // Track the scroll progress of the page (not specific to a target element)
  const { scrollYProgress } = useScroll({
    target: ref, // This still targets the specific ref for scroll progress
    offset: ["start end", "end start"], // Adjust if needed for better triggering
  });

  // Log scroll progress to check if it's updating
  scrollYProgress.onChange((latest) => {
    console.log("scrollYProgress: ", latest);
  });

  return (
    <>
      {/* Add a large container to make sure there's enough scrollable area */}
      <div style={{ height: "200vh", paddingTop: "100vh" }}>
        <motion.div
          ref={ref}
          style={{
            scaleX: scrollYProgress, // Scale based on scroll progress
            opacity: scrollYProgress, // Opacity based on scroll progress
          }}
          className="absolute items-center justify-center bg-white"
        >
          Hello World
        </motion.div>
      </div>
    </>
  );
}

export default Scroll;
