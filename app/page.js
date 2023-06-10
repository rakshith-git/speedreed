'use client'
import React, { useState,useEffect } from "react";
import Link from "next/link";
import Navbar from "./navbar"
import { auth,db } from "./firebaseConfig";
import Textbox from "./textbox"
import Topbar from "./topbar"
import { useAppSelector } from "app/redux/store.js";
import {doc,getDocs,collection,addDoc,setDoc,updateDoc} from 'firebase/firestore'

export default function Home() {
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("")
  const {render,textbox}=Textbox()
  const userRef = collection(db,'users');
  const rsvpText=useAppSelector((state)=>state.textReducer.value.text)
  const currentTextCollectionRef = collection(db,'currentText');
  useEffect(() => {
    const timer = setTimeout(() => {
      if (auth.currentUser) {
        setEmail(auth?.currentUser.email);
        setUid(auth?.currentUser.uid)
        createuserDocument()
        console.log("yooooo")
      }
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const uploadtofb= async ()=>{
    try {
      
      await updateDoc(doc(db,'users',uid),{
        text:rsvpText
        
      });
    } catch (error) {
      console.log(error)
    }
    
  }
  const createuserDocument = async () => {
    try {
      
  
      await setDoc(doc(db,'users',uid),{text:"lol"})
     
  
      console.log('Current text document created successfully!');
    } catch (error) {
      console.error('Error creating current text document:', error);
    }
  };
  
  return (
    <>
    <h1 className="text-white">{uid}</h1>
    
    <div className="mt-4 dark:text-gray-100"></div>
    {render}
    
    <div className="flex justify-center">
        <Link
          href="/rsvp"
          onClick={uploadtofb}
          type="button"
          className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800"
        >
          Finalize Text
        </Link>
      </div>
    
    
    </>
  )
}
