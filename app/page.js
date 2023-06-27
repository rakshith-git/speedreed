'use client'
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "./navbar";
import { auth, db } from "./firebaseConfig";
import Textbox from "./textbox";
import Topbar from "./topbar";
import { useAppSelector } from "app/redux/store.js";
import { doc, collection, setDoc,getDoc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function Home() {
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");
  const [docCreated, setDocCreated] = useState(false);
  const { render, textbox } = Textbox();
  const rsvpText = useAppSelector((state) => state.textReducer.value.text);

  useEffect(() => {
    const checkUser = async () => {
      if (auth.currentUser) {
        setEmail(auth.currentUser.email);
        setUid(auth.currentUser.uid);
        await createOrUpdateUserDocument();
        console.log("yooooo");
      }
    };

    checkUser();
  }, []);

  const uploadToFirebase = async () => {
    try {
      await updateDoc(doc(db, "users", uid), {
        text: rsvpText,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const createOrUpdateUserDocument = async () => {
    if (uid) {
      const userDocRef = doc(db, "users", uid);
      const userDocSnapshot = await getDoc(userDocRef);
  
      if (userDocSnapshot.exists()) {
        await updateDoc(userDocRef, {
          text: rsvpText,
        });
        console.log("User document updated successfully!");
      } else {
        await setDoc(userDocRef, {
          text: rsvpText,
          defaultSpeed: 240,
          defaultSpeech: 1,
          bionic: parseInt(0),
          burst:parseInt(0),
        });
        console.log("User document created successfully!");
        setDocCreated(true);
      }
    } else {
      console.log("Empty uid detected. Skipping Firestore operations.");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFinalizeText = async () => {
    if (docCreated) {
      await uploadToFirebase();
    } else {
      await createOrUpdateUserDocument();
      await uploadToFirebase();
    }
  };

  return (
    <>
      <div className="mt-4 dark:text-gray-100"></div>
      {render}

      <div className="flex justify-center">
        <Link
          href="/rsvp"
          onClick={handleFinalizeText}
          type="button"
          className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800"
        >
          Finalize Text
        </Link>
      </div>
    </>
  );
}
