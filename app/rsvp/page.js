"use client";
import React, { useState, useEffect } from "react";
import { useAppSelector } from "app/redux/store.js";
import { auth, db } from "app/firebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";

// Default settings to use if no settings are found
const DEFAULT_SETTINGS = {
  text: "",
  defaultSpeed: 240,
  defaultSpeech: 1,
  bionic: 0,
  refrence: 10,
  burst: 0,
  namedEntity: 1.0,
  content: 1.0,
  function: 1.0,
  modifiers: 1.0,
  isAIMode: false,
};

export default function RSVPReader() {
  const rsvpText = useAppSelector((state) => state.textReducer.value.text);
  const [theText, setTheText] = useState("");
  const [rangeVal, setRangeVal] = useState(DEFAULT_SETTINGS.defaultSpeed);
  const [speechVal, setSpeechVal] = useState(DEFAULT_SETTINGS.defaultSpeech);
  const [isBionic, setIsBionic] = useState(DEFAULT_SETTINGS.bionic);
  const [isburst, setIsBurst] = useState(DEFAULT_SETTINGS.burst);
  const [speaking, setSpeaking] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [increment, setIncrement] = useState(0);
  const [progress, setProgress] = useState(0);
  const [refrence, setRefrence] = useState("");
  const [refrenceLength, setRefrenceLength] = useState(DEFAULT_SETTINGS.refrence);
  const [extraTime, setExtraTime] = useState(0);
  const [textArray, setTextArray] = useState([]);
  const [posData, setPosData] = useState({ groups: [], tokens: [] });
  const [multipliers, setMultipliers] = useState({
    namedEntity: DEFAULT_SETTINGS.namedEntity,
    content: DEFAULT_SETTINGS.content,
    function: DEFAULT_SETTINGS.function,
    modifiers: DEFAULT_SETTINGS.modifiers,
  });
  const [error, setError] = useState(null);
  const [isAuth, setIsAuth] = useState(false);

  // AI-related states
  const [isAIMode, setIsAIMode] = useState(DEFAULT_SETTINGS.isAIMode);

  useEffect(() => {
    // Check if user is authenticated
    if (localStorage.getItem("isAuth") === "true") {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  }, []);

  useEffect(() => {
    const getText = async () => {
      try {
        if (isAuth && auth.currentUser) {
          // Get settings from Firebase if logged in
          const userTextDoc = await getDoc(
            doc(db, "users", auth.currentUser.uid)
          );
          const userData = userTextDoc.data();
          setTheText(userData.text || "");
          setSpeechVal(userData.defaultSpeech);
          setRangeVal(userData.defaultSpeed);
          setIsBionic(userData.bionic);
          setRefrenceLength(userData.refrence);
          setIsBurst(userData.burst);
          setIsAIMode(userData.isAIMode || false);
          setMultipliers({
            namedEntity: userData.namedEntity || DEFAULT_SETTINGS.namedEntity,
            content: userData.content || DEFAULT_SETTINGS.content,
            function: userData.function || DEFAULT_SETTINGS.function,
            modifiers: userData.modifiers || DEFAULT_SETTINGS.modifiers,
          });
        } else {
          // Get settings from localStorage if not logged in
          const localSettings = localStorage.getItem("userSettings");
          if (localSettings) {
            const settings = JSON.parse(localSettings);
            setSpeechVal(settings.defaultSpeech);
            setRangeVal(settings.defaultSpeed);
            setIsBionic(settings.bionic);
            setRefrenceLength(settings.refrence);
            setIsBurst(settings.burst);
            setIsAIMode(settings.isAIMode || false);
            setMultipliers({
              namedEntity: settings.namedEntity || DEFAULT_SETTINGS.namedEntity,
              content: settings.content || DEFAULT_SETTINGS.content,
              function: settings.function || DEFAULT_SETTINGS.function,
              modifiers: settings.modifiers || DEFAULT_SETTINGS.modifiers,
            });
          }
        }
      } catch (error) {
        console.log(error);
        setError("Error loading settings. Using default settings.");
      }
    };

    getText();
  }, [isAuth]);

  useEffect(() => {
    const processText = async () => {
      const text = rsvpText !== "" ? rsvpText : theText;
      if (!text) {
        setError("No text available. Please set some text before starting.");
        return;
      }
      const words = convertStringToArray(text);
      setTextArray(words);

      // Fetch POS tags regardless of AI mode
      try {
        const posData = await fetchPOSTags(text);
        setPosData(posData);
        setError(null);
      } catch (error) {
        console.error("Error fetching POS tags:", error);
        setPosData({ groups: [], tokens: [] });
        setError("Failed to fetch word types. Using default display times.");
      }
    };

    processText();
  }, [rsvpText, theText, isAIMode]);

  function convertStringToArray(text) {
    const normalizedText = text.replace(/\n/g, " ");
    return normalizedText.split(/\s+/);
  }

  async function fetchPOSTags(text) {
    const response = await fetch("https://bonemechanic-rsvp-server.hf.space/pos-tag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch POS tags");
    }
    return await response.json();
  }

  useEffect(() => {
    if (progress >= 100) {
      setProgress(100);
      setIncrement(0);
      setCurrentIndex(textArray.length - 1);
    }
    if (textArray[currentIndex] && isburst === 1 && !isAIMode) {
      textArray[currentIndex].includes(".")
        ? setExtraTime((60000 / rangeVal) * 4)
        : setExtraTime(0);
    }
    const intervalId = setInterval(() => {
      if (increment === 0 || currentIndex >= textArray.length - 1)
        return () => clearInterval(intervalId);

      setCurrentIndex((prevIndex) => {
        const newIndex = prevIndex + increment;
        setProgress(1 + (newIndex / textArray.length) * 100);
        return newIndex;
      });
    }, calculateDelay(currentIndex));

    return () => clearInterval(intervalId);
  }, [
    rangeVal,
    increment,
    progress,
    currentIndex,
    textArray,
    posData,
    multipliers,
    isburst,
    isAIMode,
  ]);

  function calculateDelay(index) {
    const baseDelay = 60000 / rangeVal;
    if (posData.groups.length === 0) {
      return baseDelay + extraTime;
    }
    const wordType = posData.groups[index];
    const multiplier = multipliers[wordType] || 1;
    return baseDelay * multiplier + extraTime;
  }

  useEffect(() => {
    let startIndex = currentIndex - parseInt(refrenceLength);
    let endAtIndex = currentIndex + parseInt(refrenceLength);
    if (currentIndex % refrenceLength == 0) {
      setRefrence(getSubstringFromArray(textArray, startIndex, endAtIndex));
    }
  }, [currentIndex, refrenceLength, textArray]);

  function getSubstringFromArray(textArray, startIndex, endIndex) {
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
    return textArray.slice(startIndex, endIndex + 1).join(" ");
  }

  const handleSpeak = () => {
    if ("speechSynthesis" in window) {
      const synthesis = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(
        getSubstringFromArray(textArray, currentIndex, textArray.length)
      );
      utterance.rate = speechVal;
      synthesis.speak(utterance);
      setSpeaking(true);
    } else {
      console.log("Speech synthesis is not supported in this browser.");
    }
  };

  const handleStop = () => {
    if ("speechSynthesis" in window && speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  };

  function Bionic({ word }) {
    if (word === undefined) {
      word = "";
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
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  if (textArray.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-xl">Loading or no text available...</p>
      </div>
    );
  }

  return (
    <>
      <h1>{textArray.length}</h1>
      <div className="flex justify-center mt-4 dark:text-gray-100">
        <h1>{refrence}</h1>
      </div>
      <div className="flex justify-center my-8 text-white text-6xl font-roboto">
        {isBionic === 1 ? (
          <Bionic word={textArray[currentIndex]} />
        ) : (
          textArray[currentIndex]
        )}
      </div>

      <div className="flex justify-center">
        <div className="w-10/12 bg-gray-200 rounded-full h-2.5 my-10 dark:bg-gray-700">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: progress + "%" }}
          />
        </div>
      </div>

      <div className="flex justify-center items-center">
        {increment === 0 && currentIndex > 10 && (
          <button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-4 mr-2 my-6 mt-4 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none dark:focus:ring-blue-800"
            onClick={() => {
              if (currentIndex > 10) {
                setCurrentIndex(currentIndex - 10);
                setProgress(1 + ((currentIndex - 10) / textArray.length) * 100);
              }
            }}
          >
            ⏪ Rewind ⏪
          </button>
        )}
      </div>

      {!isAIMode && (
        <>
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
        </>
      )}

      {isAIMode && (
        <div className="flex justify-center">
          <p className="text-center mb-4 text-sm font-medium text-gray-900 dark:text-white">
            AI Mode: Reading speed adjusts automatically based on content complexity
          </p>
        </div>
      )}

      <div className="flex my-10 justify-center">
        <button
          type="button"
          onClick={() => {
            if (increment === 1) {
              setIncrement(0);
              window.speechSynthesis.cancel();
            } else {
              setIncrement(1);
            }
          }}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          {increment === 1 ? "Stop" : "Start"}
        </button>
        <button
          type="button"
          onClick={() => {
            setProgress(0);
            setCurrentIndex(0);
            setIncrement(0);
            window.speechSynthesis.cancel();
          }}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Restart
        </button>
        <button
          type="button"
          onClick={speaking === false ? handleSpeak : handleStop}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          {speaking === true ? "Stop" : "Speak"}
        </button>
      </div>
    </>
  );
}
