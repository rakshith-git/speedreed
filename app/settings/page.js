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

// Default settings object
const DEFAULT_SETTINGS = {
  defaultSpeed: 240,
  defaultSpeech: 3,
  bionic: 0,
  burst: 0,
  refrence: 10,
  namedEntity: 1.0,
  content: 1.0,
  function: 1.0,
  modifiers: 1.0,
  isAIMode: false,
};

function Home() {
  const [rangeVal, setRangeVal] = useState(DEFAULT_SETTINGS.defaultSpeed);
  const [speechVal, setSpeechVal] = useState(DEFAULT_SETTINGS.defaultSpeech);
  const [bionicVal, setBionicVal] = useState(DEFAULT_SETTINGS.bionic);
  const [burstVal, setBurstVal] = useState(DEFAULT_SETTINGS.burst);
  const [refrenceVal, setRefrenceVal] = useState(DEFAULT_SETTINGS.refrence);
  const [bionicText, setBionicText] = useState("Normal");
  const [namedEntityVal, setNamedEntityVal] = useState(DEFAULT_SETTINGS.namedEntity);
  const [contentVal, setContentVal] = useState(DEFAULT_SETTINGS.content);
  const [functionVal, setFunctionVal] = useState(DEFAULT_SETTINGS.function);
  const [modifiersVal, setModifiersVal] = useState(DEFAULT_SETTINGS.modifiers);
  const [isAIMode, setIsAIMode] = useState(DEFAULT_SETTINGS.isAIMode);

  const [isAuth, setIsAuth] = useState(false);
  
  useEffect(() => {
    if (localStorage.getItem("isAuth") === "true") {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
    setBionicText(bionicVal === 0 ? "Normal" : "Bionic");
  }, [bionicVal]);

  const saveSettings = async () => {
    // Create settings object
    const settings = {
      defaultSpeed: rangeVal,
      defaultSpeech: speechVal,
      bionic: parseInt(bionicVal),
      burst: parseInt(burstVal),
      refrence: refrenceVal,
      namedEntity: namedEntityVal,
      content: contentVal,
      function: functionVal,
      modifiers: modifiersVal,
      isAIMode: isAIMode,
    };

    try {
      if (isAuth && auth.currentUser) {
        // Save to Firebase if logged in
        await updateDoc(doc(db, "users", auth.currentUser.uid), settings);
      } else {
        // Save to localStorage if not logged in
        localStorage.setItem("userSettings", JSON.stringify(settings));
      }
      alert("Settings saved successfully!");
    } catch (error) {
      console.log(error);
      alert("Failed to save settings.");
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        if (isAuth && auth.currentUser) {
          // Get settings from Firebase if logged in
          const userDocRef = doc(db, "users", auth.currentUser.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setRangeVal(userData.defaultSpeed);
            setSpeechVal(userData.defaultSpeech);
            setBionicVal(userData.bionic);
            setBurstVal(userData.burst);
            setRefrenceVal(userData.refrence);
            setNamedEntityVal(userData.namedEntity || 1.0);
            setContentVal(userData.content || 1.0);
            setFunctionVal(userData.function || 1.0);
            setModifiersVal(userData.modifiers || 1.0);
            setIsAIMode(userData.isAIMode || false);
          }
        } else {
          // Get settings from localStorage if not logged in
          const localSettings = localStorage.getItem("userSettings");
          if (localSettings) {
            const settings = JSON.parse(localSettings);
            setRangeVal(settings.defaultSpeed);
            setSpeechVal(settings.defaultSpeech);
            setBionicVal(settings.bionic);
            setBurstVal(settings.burst);
            setRefrenceVal(settings.refrence);
            setNamedEntityVal(settings.namedEntity || 1.0);
            setContentVal(settings.content || 1.0);
            setFunctionVal(settings.function || 1.0);
            setModifiersVal(settings.modifiers || 1.0);
            setIsAIMode(settings.isAIMode || false);
          }
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };
    getData();
  }, [isAuth]);

  useEffect(() => {
    setBionicText(bionicVal === 0 ? "Normal" : "Bionic");
  }, [bionicVal]);

  return (
    <>
      <label
        htmlFor="default-range"
        className="flex my-4 mx-4 text-xl font-medium text-gray-900 dark:text-white"
      >
        Set default speed to:
      </label>
      <div className="flex mt-8 justify-center">
        <label
          htmlFor="default-range"
          className="block mb-4 mx-10 text-sm font-medium text-gray-900 dark:text-white"
        >
          {rangeVal} words/minute
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
        className="flex my-4 mx-4 text-xl font-medium text-gray-900 dark:text-white"
      >
        Set default Reference words limit to:
      </label>
      <div className="flex mt-8 justify-center">
        <label
          htmlFor="default-range"
          className="block mb-4 mx-10 text-sm font-medium text-gray-900 dark:text-white"
        >
          {refrenceVal} words
        </label>
      </div>

      <div className="flex justify-center">
        <input
          id="default-range"
          type="range"
          min={1}
          max={20}
          value={refrenceVal}
          onChange={(event) => setRefrenceVal(event.target.value)}
          className="w-10/12 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
      </div>

      <label
        htmlFor="default-range"
        className="flex my-8 mx-4 text-xl font-medium text-gray-900 dark:text-white"
      >
        Set Speech speed to:
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
          max={5}
          value={speechVal}
          step={0.01}
          onChange={(event) => setSpeechVal(event.target.value)}
          className="w-10/12 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
      </div>
      <label
        htmlFor="default-range"
        className="flex my-8 mx-4 text-xl font-medium text-gray-900 dark:text-white"
      >
        Toggle reading mode ({bionicText}):
      </label>
      <div className="flex justify-center mt-12">
        <div className="mb-4">
          <input
            className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
            type="checkbox"
            role="switch"
            id="flexSwitchCheckDefault01"
            checked={bionicVal === 1 ? true : false}
            onChange={(event) => {
              const isChecked = event.target.checked;
              setBionicVal(isChecked ? 1 : 0);
              setBionicText(isChecked ? "Bionic" : "Normal");
            }}
          />
        </div>
      </div>
      <label
        htmlFor="default-range"
        className="flex my-8 mx-4 text-xl font-medium text-gray-900 dark:text-white"
      >
        Toggle burst mode :
      </label>

      <div className="flex justify-center mt-12">
        <div className="mb-4">
          <input
            className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
            type="checkbox"
            role="switch"
            id="flexSwitchCheckDefault01"
            checked={burstVal === 1 ? true : false}
            onChange={(event) => {
              const isChecked = event.target.checked;
              setBurstVal(isChecked ? 1 : 0);
            }}
          />
        </div>
      </div>

      <label
        htmlFor="default-range"
        className="flex my-8 mx-4 text-xl font-medium text-gray-900 dark:text-white"
      >
        Toggle AI mode:
      </label>

      <div className="flex justify-center mt-12">
        <div className="mb-4">
          <input
            className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
            type="checkbox"
            role="switch"
            id="aiModeSwitch"
            checked={isAIMode}
            onChange={(event) => {
              setIsAIMode(event.target.checked);
            }}
          />
        </div>
      </div>
      <p className="text-center mx-4 text-sm text-gray-500 mb-6">
        AI mode uses advanced analysis to dynamically adjust reading speed based on content complexity.
      </p>

      <div className="mt-12 mb-8">
        <h2 className="flex my-4 mx-4 text-xl font-medium text-gray-900 dark:text-white">
          Advanced Options
        </h2>
        <p className="mx-4 text-sm text-gray-500 mb-6">
          These options allow you to fine-tune the emphasis on different types
          of words and elements in the text.
        </p>

        <div className="space-y-8">
          <div>
            <label
              htmlFor="named-entity"
              className="flex my-4 mx-4 text-xl font-medium text-gray-900 dark:text-white"
            >
              Named Entity: {namedEntityVal.toFixed(2)}x
            </label>
            <p className="mx-4 text-sm text-gray-500 mb-2">
              Adjust emphasis on special words with higher contextual
              importance.
            </p>
            <div className="flex justify-center">
              <input
                id="named-entity"
                type="range"
                min={0.3}
                max={5}
                step={0.01}
                value={namedEntityVal}
                onChange={(event) =>
                  setNamedEntityVal(parseFloat(event.target.value))
                }
                className="w-10/12 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="content"
              className="flex my-4 mx-4 text-xl font-medium text-gray-900 dark:text-white"
            >
              Content: {contentVal.toFixed(2)}x
            </label>
            <p className="mx-4 text-sm text-gray-500 mb-2">
              Adjust emphasis on nouns, proper nouns, verbs, adjectives, and
              interjections.
            </p>
            <div className="flex justify-center">
              <input
                id="content"
                type="range"
                min={0.3}
                max={5}
                step={0.01}
                value={contentVal}
                onChange={(event) =>
                  setContentVal(parseFloat(event.target.value))
                }
                className="w-10/12 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="function"
              className="flex my-4 mx-4 text-xl font-medium text-gray-900 dark:text-white"
            >
              Function: {functionVal.toFixed(2)}x
            </label>
            <p className="mx-4 text-sm text-gray-500 mb-2">
              Adjust emphasis on determiners, pronouns, adpositions, auxiliary
              verbs, and conjunctions.
            </p>
            <div className="flex justify-center">
              <input
                id="function"
                type="range"
                min={0.3}
                max={5}
                step={0.01}
                value={functionVal}
                onChange={(event) =>
                  setFunctionVal(parseFloat(event.target.value))
                }
                className="w-10/12 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="modifiers"
              className="flex my-4 mx-4 text-xl font-medium text-gray-900 dark:text-white"
            >
              Modifiers: {modifiersVal.toFixed(2)}x
            </label>
            <p className="mx-4 text-sm text-gray-500 mb-2">
              Adjust emphasis on symbols and other modifying elements.
            </p>
            <div className="flex justify-center">
              <input
                id="modifiers"
                type="range"
                min={0.3}
                max={5}
                step={0.01}
                value={modifiersVal}
                onChange={(event) =>
                  setModifiersVal(parseFloat(event.target.value))
                }
                className="w-10/12 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex my-10 py-10 justify-center">
        <button
          type="button"
          onClick={saveSettings}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Set Defaults
        </button>
      </div>
    </>
  );
}

export default Home;
