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
  const [refrenceVal,setRefrenceVal] = useState(10);
  const [bionicText, setBionicText] = useState("Normal");

  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("isAuth") === "true") {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
    setBionicText(bionicVal === 0 ? "Normal" : "Bionic");
  }, [bionicVal]);

  const uploadtofb = async () => {
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        defaultSpeed: rangeVal,
        defaultSpeech: speechVal,
        bionic: parseInt(bionicVal),
        burst: parseInt(burstVal),
        refrence: refrenceVal,
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
            setRefrenceVal(userData.refrence);
            console.log(userData);
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
    getData();
  }, []);

  useEffect(() => {
    setBionicText(bionicVal === 0 ? "Normal" : "Bionic");
  }, [bionicVal]);

  return (
    <>
      {!isAuth ? (
        <label
          htmlFor="default-range"
          className="flex justify-center my-4 mx-4 text-3xl font-medium text-gray-900 dark:text-white"
        >
          Please login to use this feature
        </label>
      ) : (
        <></>
      )}

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
      <div className="flex my-10 py-10 justify-center">
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
