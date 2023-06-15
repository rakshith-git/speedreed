"use client";
import React, { useState, useEffect } from "react";
import {doc,getDoc,collection,addDoc,setDoc,updateDoc} from 'firebase/firestore'
import { auth,db } from "../firebaseConfig";
const userRef = collection(db,'users');
function Home() {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (auth.currentUser) {
        getData();
        console.log("hoiii")
      }
    }, 400);

    return () => clearTimeout(timer);
  }, []);
  const [rangeVal, setRangeVal] = useState(240);
  const [speechVal, setSpeechVal] = useState(3);
  const [isbionic, setIsBionic] = useState("Normal");

  const uploadtofb= async ()=>{
    try {
      
      await updateDoc(doc(db,'users',auth.currentUser.uid),{
        defaultSpeed:rangeVal,
        defaultSpeech:speechVal,
        bionic:(isbionic==="Normal")?false:true
        
      });
    } catch (error) {
      console.log(error)
    }
    
  }
  const getData = async () => {
    try {
      const userTextDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      setRangeVal(userTextDoc.data().defaultSpeed);
      setSpeechVal(userTextDoc.data().defaultSpeech)
      setIsBionic((userTextDoc.data().isBionic===false)?"Normal":"Bionic")
      
      console.log();
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <>
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
        Toggle Reading mode (Normal/bionic):
      </label>
      <div className="flex justify-center mt-12">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            defaultValue="checked"
            className="sr-only peer"
            onClick={() =>
              setIsBionic((prevIsBionic) =>
                prevIsBionic === "Normal" ? "Bionic" : "Normal"
              )
            }
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            {isbionic}
          </span>
        </label>
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
