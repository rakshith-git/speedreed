"use client";
import React from "react";
import Link from "next/link";
import { Dock, DockIcon } from "@/components/ui/dock";
import { Home, ChartLine, User, BookOpen, Settings } from "lucide-react";

export default function CustomDock() {
  return (
    <div className="fixed bottom-10 left-0 right-0 bg-gray-950 z-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <Dock direction="middle" className="py-2">
          <DockIcon>
            <Link
              href="/home"
              className="flex w-full h-full items-center justify-center text-white hover:bg-gray-900 hover:rounded-full p-2"
            >
              <Home className="w-6 h-6" />
            </Link>
          </DockIcon>
          <DockIcon>
            <Link
              href="/rsvp"
              className="flex w-full h-full items-center justify-center text-white hover:bg-gray-900 hover:rounded-full p-2"
            >
              <BookOpen className="w-6 h-6" />
            </Link>
          </DockIcon>
          <DockIcon>
            <Link
              href="/settings"
              className="flex w-full h-full items-center justify-center text-white hover:bg-gray-900 hover:rounded-full p-2"
            >
              <Settings className="w-6 h-6" />
            </Link>
          </DockIcon>
          <DockIcon>
            <Link
              href="/stats"
              className="flex w-full h-full items-center justify-center text-white hover:bg-gray-900 hover:rounded-full p-2"
            >
              <ChartLine className="w-6 h-6" />
            </Link>
          </DockIcon>
          <DockIcon>
            <Link
              href="/profile"
              className="flex w-full h-full items-center justify-center text-white hover:bg-gray-900 hover:rounded-full p-2"
            >
              <User className="w-6 h-6" />
            </Link>
          </DockIcon>
        </Dock>
      </div>
    </div>
  );
}
