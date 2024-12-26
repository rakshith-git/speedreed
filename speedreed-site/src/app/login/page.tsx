"use client";

import React, { useState } from "react";
import FlickeringGrid from "@/components/ui/flickering-grid";
import HyperText from "@/components/ui/hyper-text";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Page() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start pt-10 px-4 overflow-hidden">
      {/* Flickering Grid Background */}
      <FlickeringGrid
        className="absolute inset-0 z-0"
        squareSize={4}
        gridGap={6}
        color="#6B7280"
        maxOpacity={0.5}
        flickerChance={0.1}
      />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-md ">
        {/* HyperText Title */}
        <div className="flex items-center justify-center">
          <HyperText
            key={isLogin ? "login" : "register"}
            className="text-4xl font-bold text-center text-black dark:text-white mb-6"
            text={isLogin ? "LOGIN" : "REGISTER"}
          />
        </div>
        {/* Card */}
        <Card className="w-full bg-white/80 dark:bg-black/80 backdrop-blur-sm">
          <CardHeader></CardHeader>
          <CardContent>
            <form className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" type="text" />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  placeholder="example@gmail.com"
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" placeholder="••••••••" type="password" />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Need to register?" : "Already have an account?"}
            </Button>
            <Button>{isLogin ? "Login" : "Sign Up"}</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
