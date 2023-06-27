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

  const [rangeVal, setRangeVal] = useState(240);
  const [speechVal, setSpeechVal] = useState(3);
  const [bionicVal, setBionicVal] = useState(0);
  const [burstVal, setBurstVal] = useState(0);
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
        burst:parseInt(burstVal),
      });
    } catch (error) {
      console.log(error);
    }
  };
useEffect(() => {
  const getData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
  
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setRangeVal(userData.defaultSpeed);
          setSpeechVal(userData.defaultSpeech);
          setBionicVal(userData.bionic);
          setBurstVal(userData.burst);
        } else {
          console.log("User document does not exist");
        }
      } else {
        console.log("User is not logged in");
      }
    } catch (error) {
      console.log("Error fetching user data:", error);
    }
  };
  getData()
  
}, [])

useEffect(() => {
  setBionicText(bionicVal === 0 ? "Normal" : "Bionic");
}, [bionicVal]);

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
            const value = event.target.value;
            setBionicVal(value);
            setBionicText(value === 0 ? "Normal" : "Bionic");
          }}
          
          className=" w-8 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
      </div>
      <label
        htmlFor="default-range"
        className="flex my-8 mx-4 text-xl font-medium text-gray-900 dark:text-white"
      >
        Toggle burst mode :
      </label>
      <div className="flex justify-center mt-12">
        
        <input
          id="default-range"
          type="range"
          min={0}
          max={1}
          value={burstVal}
          step={1}
          onChange={(event) => {
            const value = event.target.value;
            setBurstVal(value);
            
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
