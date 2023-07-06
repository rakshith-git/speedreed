"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "./navbar";
import Topbar from "./topbar";
import { ReduxProvider } from "app/redux/features/provider.js";
import { Analytics } from "@vercel/analytics/react";

import { store } from "app/redux/store.js";

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: 'SpeedReed - RSVP App for Rapid Reading',
//   description: 'SpeedReed is a powerful RSVP app that enables rapid reading, text extraction, user preferences, text-to-speech, and bionic mode for enhanced comprehension. Read faster and retain more with SpeedReed!',
//   openGraph: {
//     title: 'SpeedReed - RSVP App for Rapid Reading',
//     description: 'SpeedReed is a powerful RSVP app that enables rapid reading, text extraction, user preferences, text-to-speech, and bionic mode for enhanced comprehension. Read faster and retain more with SpeedReed!',
//     images: [
//       { url: 'https://example.com/your-image.jpg', alt: 'SpeedReed Logo' }
//     ]
//   },
//   generator: 'Next.js',
//   keywords: [
//     "Speedreed",
//     "Speedreading",
//     "Rapid reading",
//     "Reading techniques",
//     "Comprehension",
//     "Efficient reading",
//     "Reading skills",
//     "Speed reading tips",
//     "Increase reading speed",
//     "Reading strategies",
//     "Speed reading exercises",
//     "Speed reading courses",
//     "Speed reading practice",
//     "Speed reading benefits",
//     "Speed reading tools",
//     "Speed reading software"
//   ],
//   colorScheme: 'dark',
//   creator: 'Bone Mechanic',
//   twitter: {
//     handle: '@speedreed',
//     site: '@speedreed',
//     cardType: 'summary_large_image'
//   }
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8376660329507482"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body
        className={`{inter.className} border-gray-200 bg-gray-50 dark:bg-gray-900 dark:border-gray-700 `}
      >
        <ReduxProvider store={store}>
          <Topbar />
          <Navbar />
          {children}
          <Analytics />
        </ReduxProvider>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="apple-touch-icon"
          href="app/speedreedMobile.png"
          type="image/png"
          sizes="180x180"
        />
        <link
          rel="icon"
          href="app/speedreedMobile.png"
          type="image/png"
          sizes="180x180"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap"
          rel="stylesheet"
        ></link>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.js"></script>
      </body>
    </html>
  );
}
