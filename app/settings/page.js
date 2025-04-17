"use client";
import React, { useState, useEffect, useCallback } from "react";
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
  defaultSpeed: 350,
  defaultSpeech: 3,
  bionic: 0,
  burst: 0,
  refrence: 10,
  namedEntity: 3.0,
  content: 2.0,
  function: 0.75,
  modifiers: 2.0,
  wordLengthMultiplier: 1.5,
  perCharacterDelay: 0.1,
  isAIMode: true,
};

// Debounce function to limit save operations
function useDebounce(callback, delay) {
  const debouncedFn = useCallback(
    (...args) => {
      const handler = setTimeout(() => callback(...args), delay);
      return () => clearTimeout(handler);
    },
    [callback, delay]
  );
  return debouncedFn;
}

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
  const [wordLengthMultiplierVal, setWordLengthMultiplierVal] = useState(DEFAULT_SETTINGS.wordLengthMultiplier);
  const [perCharacterDelayVal, setPerCharacterDelayVal] = useState(DEFAULT_SETTINGS.perCharacterDelay);
  const [isAIMode, setIsAIMode] = useState(DEFAULT_SETTINGS.isAIMode);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [isAuth, setIsAuth] = useState(false);
  const [settingsChanged, setSettingsChanged] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("isAuth") === "true") {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
    setBionicText(bionicVal === 0 ? "Normal" : "Bionic");
  }, [bionicVal]);

  const saveSettings = async () => {
    if (isSaving) return;

    setIsSaving(true);

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
      wordLengthMultiplier: wordLengthMultiplierVal,
      perCharacterDelay: perCharacterDelayVal,
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
      console.log("Settings saved");
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
      setSettingsChanged(false);
    }
  };

  // Create a debounced version of saveSettings with 500ms delay
  const debouncedSave = useDebounce(saveSettings, 500);

  // Mark settings as changed when any value updates
  useEffect(() => {
    setSettingsChanged(true);
    // Start the debounced save
    const cleanup = debouncedSave();
    return cleanup;
  }, [rangeVal, speechVal, bionicVal, burstVal, refrenceVal, namedEntityVal, contentVal, functionVal, modifiersVal, wordLengthMultiplierVal, perCharacterDelayVal, isAIMode]);

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
            setWordLengthMultiplierVal(userData.wordLengthMultiplier || 1.0);
            setPerCharacterDelayVal(userData.perCharacterDelay || 0.1);
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
            setWordLengthMultiplierVal(settings.wordLengthMultiplier || 1.0);
            setPerCharacterDelayVal(settings.perCharacterDelay || 0.1);
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

  const resetToDefaults = () => {
    setRangeVal(DEFAULT_SETTINGS.defaultSpeed);
    setSpeechVal(DEFAULT_SETTINGS.defaultSpeech);
    setBionicVal(DEFAULT_SETTINGS.bionic);
    setBurstVal(DEFAULT_SETTINGS.burst);
    setRefrenceVal(DEFAULT_SETTINGS.refrence);
    setNamedEntityVal(DEFAULT_SETTINGS.namedEntity);
    setContentVal(DEFAULT_SETTINGS.content);
    setFunctionVal(DEFAULT_SETTINGS.function);
    setModifiersVal(DEFAULT_SETTINGS.modifiers);
    setWordLengthMultiplierVal(DEFAULT_SETTINGS.wordLengthMultiplier);
    setPerCharacterDelayVal(DEFAULT_SETTINGS.perCharacterDelay);
    setIsAIMode(DEFAULT_SETTINGS.isAIMode);
  };

  return (
    <div className="bg-[#151926] min-h-screen overflow-auto pb-24" style={{ color: "rgb(209, 213, 219)" }}>
      <div className="max-w-3xl mx-auto pt-8 px-4">
        <h1 className="text-2xl font-bold text-white text-center">Reading Settings</h1>
        <p className="text-center text-gray-400 text-sm mt-2 mb-6">
          Customize your reading experience with the options below. Settings are automatically saved when changed.
        </p>

        {/* Tabs */}
        <div className="flex mb-6 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("basic")}
            className={`py-2 px-5 pb-3 text-sm font-medium transition-colors ${activeTab === "basic"
              ? "border-b-2 border-blue-500 text-blue-400"
              : "text-gray-400 hover:text-gray-300"
              }`}
          >
            Basic Settings
          </button>
          <button
            onClick={() => setActiveTab("advanced")}
            className={`py-2 px-5 pb-3 text-sm font-medium transition-colors ${activeTab === "advanced"
              ? "border-b-2 border-blue-500 text-blue-400"
              : "text-gray-400 hover:text-gray-300"
              }`}
          >
            Advanced Settings
          </button>
        </div>

        {/* Basic Settings */}
        {activeTab === "basic" && (
          <div className="bg-[#1c2032] rounded-lg overflow-hidden shadow-md">
            <div className="p-6">
              <h2 className="text-xl font-medium text-white mb-4">Reading Speed</h2>

              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Reading Speed</span>
                  <span className="text-sm font-medium">{rangeVal} words/minute</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">Adjust how fast the text will be displayed</p>
                <div className="relative">
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    value={rangeVal}
                    onChange={(e) => setRangeVal(parseInt(e.target.value))}
                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: "rgb(55, 65, 81)",
                    }}
                  />

                </div>
              </div>

              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Reference Words Limit</span>
                  <span className="text-sm font-medium">{refrenceVal} words</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">Set how many words are shown for context</p>
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={refrenceVal}
                    onChange={(e) => setRefrenceVal(parseInt(e.target.value))}
                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: "rgb(55, 65, 81)",
                    }}
                  />

                </div>
              </div>

              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Speech Speed</span>
                  <span className="text-sm font-medium">{parseFloat(speechVal).toFixed(2)} rate</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">Adjust the speed of text-to-speech</p>
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.01"
                    value={speechVal}
                    onChange={(e) => setSpeechVal(parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: "rgb(55, 65, 81)",
                    }}
                  />

                </div>
              </div>

              <h2 className="text-xl font-medium text-white mb-4 mt-8">Reading Mode</h2>

              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm mb-1">Bionic Reading</div>
                    <p className="text-xs text-gray-400">Highlights parts of words to improve reading speed</p>
                  </div>
                  <div className="relative inline-block w-12 align-middle select-none">
                    <input
                      type="checkbox"
                      className="sr-only"
                      id="bionic-toggle"
                      checked={bionicVal === 1}
                      onChange={(e) => setBionicVal(e.target.checked ? 1 : 0)}
                    />
                    <label
                      htmlFor="bionic-toggle"
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer ${bionicVal === 1 ? 'bg-blue-500' : 'bg-gray-700'}`}
                    >
                      <span
                        className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${bionicVal === 1 ? 'translate-x-6' : 'translate-x-0'}`}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm mb-1">Burst Mode</div>
                    <p className="text-xs text-gray-400">Shows multiple words at once in rapid succession</p>
                  </div>
                  <div className="relative inline-block w-12 align-middle select-none">
                    <input
                      type="checkbox"
                      className="sr-only"
                      id="burst-toggle"
                      checked={burstVal === 1}
                      onChange={(e) => setBurstVal(e.target.checked ? 1 : 0)}
                    />
                    <label
                      htmlFor="burst-toggle"
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer ${burstVal === 1 ? 'bg-blue-500' : 'bg-gray-700'}`}
                    >
                      <span
                        className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${burstVal === 1 ? 'translate-x-6' : 'translate-x-0'}`}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm mb-1">AI Mode</div>
                    <p className="text-xs text-gray-400">Dynamically adjusts reading speed based on complexity</p>
                  </div>
                  <div className="relative inline-block w-12 align-middle select-none">
                    <input
                      type="checkbox"
                      className="sr-only"
                      id="ai-toggle"
                      checked={isAIMode}
                      onChange={(e) => setIsAIMode(e.target.checked)}
                    />
                    <label
                      htmlFor="ai-toggle"
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer ${isAIMode ? 'bg-blue-500' : 'bg-gray-700'}`}
                    >
                      <span
                        className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${isAIMode ? 'translate-x-6' : 'translate-x-0'}`}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Settings */}
        {activeTab === "advanced" && (
          <div className="bg-[#1c2032] rounded-lg overflow-hidden shadow-md">
            <div className="p-6">
              <h2 className="text-xl font-medium text-white mb-3">Emphasis Controls</h2>
              <p className="text-sm text-gray-400 mb-6">
                Fine-tune how different types of words are emphasized during reading.
              </p>

              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Named Entity Emphasis</span>
                  <span className="text-sm font-medium">{namedEntityVal.toFixed(2)}×</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">Adjust emphasis on special words with higher contextual importance</p>
                <div className="relative">
                  <input
                    type="range"
                    min="0.3"
                    max="5"
                    step="0.01"
                    value={namedEntityVal}
                    onChange={(e) => setNamedEntityVal(parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: "rgb(55, 65, 81)",
                    }}
                  />

                </div>
              </div>

              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Content Emphasis</span>
                  <span className="text-sm font-medium">{contentVal.toFixed(2)}×</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">Adjust emphasis on nouns, proper nouns, verbs, adjectives, and interjections</p>
                <div className="relative">
                  <input
                    type="range"
                    min="0.3"
                    max="5"
                    step="0.01"
                    value={contentVal}
                    onChange={(e) => setContentVal(parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: "rgb(55, 65, 81)",
                    }}
                  />

                </div>
              </div>

              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Function Emphasis</span>
                  <span className="text-sm font-medium">{functionVal.toFixed(2)}×</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">Adjust emphasis on determiners, pronouns, adpositions, auxiliary verbs, and conjunctions</p>
                <div className="relative">
                  <input
                    type="range"
                    min="0.3"
                    max="5"
                    step="0.01"
                    value={functionVal}
                    onChange={(e) => setFunctionVal(parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: "rgb(55, 65, 81)",
                    }}
                  />

                </div>
              </div>

              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Modifiers Emphasis</span>
                  <span className="text-sm font-medium">{modifiersVal.toFixed(2)}×</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">Adjust emphasis on symbols and other modifying elements</p>
                <div className="relative">
                  <input
                    type="range"
                    min="0.3"
                    max="5"
                    step="0.01"
                    value={modifiersVal}
                    onChange={(e) => setModifiersVal(parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: "rgb(55, 65, 81)",
                    }}
                  />

                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Word Length Multiplier</span>
                  <span className="text-sm font-medium">{wordLengthMultiplierVal.toFixed(2)}×</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">Increase delay for longer words (higher values = more time for longer words)</p>
                <div className="relative">
                  <input
                    type="range"
                    min="0.3"
                    max="3"
                    step="0.01"
                    value={wordLengthMultiplierVal}
                    onChange={(e) => setWordLengthMultiplierVal(parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: "rgb(55, 65, 81)",
                    }}
                  />

                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Per-Character Delay Factor</span>
                  <span className="text-sm font-medium">{(perCharacterDelayVal * 100).toFixed(0)}%</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">How much extra time each additional character adds (higher values = steeper increase for longer words)</p>
                <div className="relative">
                  <input
                    type="range"
                    min="0.01"
                    max="0.5"
                    step="0.01"
                    value={perCharacterDelayVal}
                    onChange={(e) => setPerCharacterDelayVal(parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: "rgb(55, 65, 81)",
                    }}
                  />

                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mt-6 mb-20">
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
          >
            Reset to Defaults
          </button>
          <p className="text-sm text-gray-400">
            {isSaving ? "Saving..." : settingsChanged ? "Changes not yet saved..." : "Settings saved"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
