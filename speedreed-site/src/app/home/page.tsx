import TextArea from "@/components/custom/TextArea";
import HyperText from "@/components/ui/hyper-text";
import Particles from "@/components/ui/particles";
import React from "react";

function page() {
  return (
    <>
      <div className="flex items-center justify-center mt-8 z-50">
        <Particles
          className="absolute inset-0"
          quantity={500}
          ease={80}
          color={"#ffffff"}
          refresh
        />
        <HyperText
          className="text-5xl font-bold text-black dark:text-white"
          text="SPEEDREED"
        />
      </div>
      <div className="md:mx-16 lg:mx-32 flex items-end justify-end">
        <TextArea />
      </div>
    </>
  );
}

export default page;
