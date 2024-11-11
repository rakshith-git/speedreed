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

export default function Page() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-950">
      <Dock direction="middle">
        <DockIcon>
          <Link href="/home" className="w-full h-full text-white">
            <Home className="w-12 h-full text-white" />
          </Link>
        </DockIcon>
        <DockIcon>
          <Link href="/home" className="w-full h-full text-white">
            <BookOpen className="w-full h-full text-white" />
          </Link>
        </DockIcon>
        <DockIcon>
          <Link href="/home" className="w-full h-full text-white">
            <Settings className="w-full h-full text-white" />
          </Link>
        </DockIcon>
        <DockIcon>
          <Link href="/home" className="w-full h-full text-white">
            <ChartLine className="w-full h-full text-white" />
          </Link>
        </DockIcon>
        <DockIcon>
          <Link href="/home" className="w-full h-full text-white">
            <User className="w-full h-full text-white" />
          </Link>
        </DockIcon>
      </Dock>
    </div>
  );
}
