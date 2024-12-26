"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import HyperText from "@/components/ui/hyper-text";
import Particles from "@/components/ui/particles";
import { Slider } from "@radix-ui/react-slider";
import React from "react";

function page() {
  return (
    <div>
      <div className="relative min-h-screen flex flex-col items-center justify-start pt-10 px-4 overflow-hidden">
        <Particles
          className="absolute inset-0"
          quantity={1000}
          ease={80}
          color={"#00ffff"}
          refresh
        />
        {/* Content Container */}
        <div className="relative z-10 w-full max-w-md ">
          <div className="flex items-center justify-center">
            <HyperText
              className="text-4xl font-bold text-center text-black dark:text-white mb-6"
              text="SETTINGS"
            />
          </div>
          {/* HyperText Title */}
          <div className="flex items-center justify-center"></div>
          {/* Card */}
          <Card className="relative justify justify-center w-full bg-white/80 dark:bg-black/80 backdrop-blur-sm items-center">
            <CardHeader>hi</CardHeader>
            <CardContent></CardContent>
          </Card>
          <div className=" p-4">
            <Slider defaultValue={[33]} max={100} step={1} className="slider" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
