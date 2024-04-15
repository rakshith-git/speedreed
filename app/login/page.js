"use client";
import React from "react";
import { auth, googleProvider } from "app/firebaseConfig.js";
import { useState, useEffect } from "react";

import {
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  signOut,
} from "firebase/auth";
function Home() {
  return (
    <>
      <Jumbo />
    </>
  );
}

export default Home;

export function Jumbo() {
  const signInwithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      await setPersistence(result.user, browserLocalPersistence);
    } catch (error) {
      console.log(error);
    }
  };
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuth(!!user);
      localStorage.setItem("isAuth", !!user);
      console.log(localStorage.getItem("isAuth"));
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Don't Just Read it Reed it!
        </h1>
        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400">
          SpeedReed lets you unlock the full potential of human Language
          processing using various methods of speed and comprenhension enhancing
          technology
        </p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
          <div className="px-6 sm:px-0 max-w-sm">
            {!isAuth ? (
              <button
                type="button"
                onClick={signInwithGoogle}
                className="text-white w-full  bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between dark:focus:ring-[#4285F4]/55 mr-2 mb-2"
              >
                <svg
                  className="mr-2 -ml-1 w-4 h-4"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="google"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                >
                  <path
                    fill="currentColor"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                  />
                </svg>
                Sign up with Google
                <div />
              </button>
            ) : (
              <button
                type="button"
                onClick={async () => {
                  try {
                    await signOut(auth, googleProvider);
                  } catch (error) {
                    console.log(error);
                  }
                }}
                className="text-white w-full  bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between dark:focus:ring-[#4285F4]/55 mr-2 mb-2"
              >
                <svg
                  className="mr-2 -ml-1 w-4 h-4"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="google"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                >
                  <path
                    fill="currentColor"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                  />
                </svg>
                Sign Out
                <div />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
