import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import CustomDock from "@/components/custom/CustomDock";
import Particles from "@/components/ui/particles";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} overflow-hidden antialiased min-h-screen pb-16`}
      >
        {children}
        <CustomDock />
        <Particles
          className="absolute inset-0 -z-50"
          quantity={500}
          ease={80}
          color={"#ffffff"}
          refresh
        />
      </body>
    </html>
  );
}
