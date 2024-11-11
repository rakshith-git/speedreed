"use client";
import React from "react";
import Link from "next/link";
import { Dock, DockIcon } from "@/components/ui/dock";
import {
  Home,
  ChartLine,
  User,
  Folder,
  BookOpen,
  Settings,
} from "lucide-react";

export default function CustomDock() {
  return (
    <div className="scale-125 fixed bottom-10 left-0 right-0 bg-lack z-50 w-full h-fit">
      <Dock
        direction="middle"
        className="flex items-center justify-center h-fit gap-2 md:gap-8"
      >
        <DockIcon>
          <Link
            href="/home"
            className="flex w-full h-full  items-center justify-center text-white hover:bg-gray-800 hover:rounded-full p-2"
          >
            <Home className="w-full h-full text-white " />
          </Link>
        </DockIcon>
        <DockIcon>
          <Link
            href="/rsvp"
            className="flex w-full h-full items-center justify-center text-white hover:bg-gray-800 hover:rounded-full p-2"
          >
            <BookOpen className="w-full h-full text-white" />
          </Link>
        </DockIcon>
        <DockIcon>
          <Link
            href="/settings"
            className="flex w-full h-full items-center justify-center text-white hover:bg-gray-800 hover:rounded-full p-2"
          >
            <Settings className="w-full h-full text-white " />
          </Link>
        </DockIcon>
        <DockIcon>
          <Link
            href="/stats"
            className="flex w-full h-full items-center justify-center text-white hover:bg-gray-800 hover:rounded-full p-2"
          >
            <ChartLine className="w-full h-full text-white " />
          </Link>
        </DockIcon>
        <DockIcon>
          <Link
            href="/profile"
            className="flex w-full h-full items-center justify-center text-white hover:bg-gray-800 hover:rounded-full p-2"
          >
            <User className="w-full h-full text-white " />
          </Link>
        </DockIcon>
      </Dock>
    </div>
  );
}
