"use client";
import React, { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
const userRef = collection(db, "users");
function Home() {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (auth.currentUser) {
        getData();
        console.log("hoiii");
      }
    }, 400);

    return () => clearTimeout(timer);
  }, []);
  const [rangeVal, setRangeVal] = useState(240);
  const [speechVal, setSpeechVal] = useState(3);
  const [bionicVal, setBionicVal] = useState(0);
  const [bionicText, setBionicText] = useState("Normal");

  useEffect(() => {
    setBionicText(bionicVal===0?"Normal":"Bionic")
  }, [bionicVal])
  
  const uploadtofb = async () => {
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        defaultSpeed: rangeVal,
        defaultSpeech: speechVal,
        bionic: parseInt(bionicVal),
      });
    } catch (error) {
      console.log(error);
    }
  };
  const getData = async () => {
    try {
      const userTextDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      setRangeVal(userTextDoc.data().defaultSpeed);
      setSpeechVal(userTextDoc.data().defaultSpeech);
      setBionicVal(userTextDoc.data().bionic);

      console.log();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
    <h1 className="text-white">Login to use defaults</h1>
      <label
        htmlFor="default-range"
        className="flex my-4 mx-4 text-xl font-medium text-gray-900 dark:text-white"
      >
        set default speed to:
      </label>
      <div className="flex mt-8 justify-center">
        <label
          htmlFor="default-range"
          className="block mb-4 mx-10 text-sm font-medium text-gray-900 dark:text-white"
        >
          {rangeVal} Words/Minute
        </label>
      </div>

      <div className="flex justify-center">
        <input
          id="default-range"
          type="range"
          min={100}
          max={1000}
          value={rangeVal}
          onChange={(event) => setRangeVal(event.target.value)}
          className="w-10/12 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
      </div>

      <label
        htmlFor="default-range"
        className="flex my-8 mx-4 text-xl font-medium text-gray-900 dark:text-white"
      >
        set Speech speed to:
      </label>
      <div className="flex mt-8 justify-center">
        <label
          htmlFor="default-range"
          className="block mb-4 mx-10 text-sm font-medium text-gray-900 dark:text-white"
        >
          {speechVal} rate
        </label>
      </div>

      <div className="flex justify-center">
        <input
          id="default-range"
          type="range"
          min={1}
          max={10}
          value={speechVal}
          step={0.1}
          onChange={(event) => setSpeechVal(event.target.value)}
          className="w-10/12 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
      </div>
      <label
        htmlFor="default-range"
        className="flex my-8 mx-4 text-xl font-medium text-gray-900 dark:text-white"
      >
        Toggle Reading mode ({bionicText}):
      </label>
      <div className="flex justify-center mt-12">
        
        <input
          id="default-range"
          type="range"
          min={0}
          max={1}
          value={bionicVal}
          step={1}
          onChange={(event) => {
            setBionicVal(event.target.value);
          }}
          className=" w-8 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
      </div>
      <div className="flex my-10 justify-center">
        <button
          type="button"
          onClick={uploadtofb}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Set Defaults
        </button>
      </div>
    </>
  );
}

export default Home;
