"use client";
import React, { useState, useEffect } from "react";
import Textbox from "../textbox";
import { useSelector } from "react-redux";
import { useAppSelector } from "app/redux/store.js";
import { auth } from "app/firebaseConfig.js";

import {
  doc,
  getDoc,
  collection,
  addDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function Home() {
  let count = 0;

  const rsvpText = useAppSelector((state) => state.textReducer.value.text);
  const userRef = collection(db, "users");
  const [theText, setTheText] = useState("");
  const [rangeVal, setRangeVal] = useState(240);
  const [speechVal, setSpeechVal] = useState(1);
  const [isBionic, setIsBionic] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [increment, setIncrement] = useState(0);
  const [progress, setProgress] = useState(0);
  const [refrence, setRefrence] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      if (auth.currentUser) {
        getText();
        console.log("hloo");
      }
    }, 400);

    return () => clearTimeout(timer);
  }, []);
  const getText = async () => {
    try {
      const userTextDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      setTheText(userTextDoc.data().text);
      setSpeechVal(userTextDoc.data().defaultSpeech)
      setIsBionic(userTextDoc.data().bionic)
      
      console.log(theText);
    } catch (error) {}
  };

  function convertStringToArray(text) {
    // Replace new lines with spaces
    const normalizedText = text.replace(/\n/g, " ");

    // Split the normalized text into an array of words
    const wordsArray = normalizedText.split(/\s+/);

    return wordsArray;
  }

  const textArray = convertStringToArray(theText !== "" ? theText : rsvpText);

  useEffect(() => {
    if (progress >= 100) {
      setProgress(100);
      setIncrement(0);
      setCurrentIndex(textArray.length - 1);
    }
    const intervalId = setInterval(() => {
      if (increment === 0 || count >= textArray.length - 1)
        return () => clearInterval(intervalId);

      setCurrentIndex((currentIndex) => {
        setProgress(1 + (currentIndex / textArray.length) * 100);
        
        return currentIndex + increment;
      });

      count++;
    }, 60000 / rangeVal); // Change the interval time here to adjust the speed of the RSVP
    return () => clearInterval(intervalId);
  }, [rangeVal, increment, progress]);

  useEffect(() => {
    if (currentIndex % 10 == 0)
      setRefrence(
        getSubstringFromArray(textArray, currentIndex - 10, currentIndex + 10)
      );
  }, [currentIndex]);

  function getSubstringFromArray(textArray, startIndex, endIndex) {
    // Validate input
    if (startIndex < 0) startIndex = 0;
    if (endIndex >= textArray.length - 1) endIndex = textArray.length - 1;
    if (
      !Array.isArray(textArray) ||
      typeof startIndex !== "number" ||
      typeof endIndex !== "number" ||
      startIndex < 0 ||
      endIndex < 0 ||
      startIndex >= textArray.length ||
      endIndex >= textArray.length ||
      startIndex > endIndex
    ) {
      return "";
    }

    // Extract the substring
    const substring = textArray.slice(startIndex, endIndex + 1).join(" ");

    return substring;
  }
  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const synthesis = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(getSubstringFromArray(textArray,currentIndex,textArray.length));
      utterance.rate = speechVal;
      synthesis.speak(utterance);
      setSpeaking(true);
    } else {
      console.log('Speech synthesis is not supported in this browser.');
    }
  };
  const handleStop = () => {
    if ('speechSynthesis' in window && speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  };
  return (
    <>
      <h1>{textArray.length}</h1>
      <div className="flex justify-center mt-4 dark:text-gray-100">
        <h1>{refrence}</h1>
      </div>
      <div className="flex justify-center my-8 text-white text-6xl font-roboto">
        {(isBionic===1)?<Bionic word={textArray[currentIndex]}/>:textArray[currentIndex]}
      </div>

      <div className="flex justify-center">
        <div className="w-10/12 bg-gray-200 rounded-full h-2.5 my-10 dark:bg-gray-700">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: progress + "%" }}
          />
        </div>
      </div>
      <div className="flex justify-center">
        <label
          htmlFor="default-range"
          className="block mb-4 text-sm font-medium text-gray-900 dark:text-white"
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
      <div className="flex my-10 justify-center">
        <button
          type="button"
          onClick={() => {
            
            if (increment === 1) {
              setIncrement(0);
              window.speechSynthesis.cancel()
             
            } else {
              
              setIncrement(1);
            }
          }}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Start
        </button>
        <button
          type="button"
          onClick={() => {
            setProgress(0);
            setCurrentIndex(0);
            setIncrement(0);
            count = 0;
            window.speechSynthesis.cancel()
          }}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Restart
        </button>
        <button
          type="button"
          onClick={(speaking===false)?handleSpeak:handleStop}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Speech
        </button>
        
      </div>
    </>
  );
}
export function Bionic( {word} ) {
  if(word===undefined){
    word=""
  }
  const halfLength = Math.floor(word.length / 2);
  const firstHalf = word.slice(0, halfLength);
  const secondHalf = word.slice(halfLength);

  return (
    <div className="text-gray-400 text-6xl font-roboto">
      <span className="text-white text-6xl font-roboto">{firstHalf}</span>
      {secondHalf}
    </div>
  );
};
