'use client'
import React, { useState } from "react";
import Textbox from "../textbox"
import { useSelector } from "react-redux";
import { useAppSelector } from "app/redux/store.js";
import {auth} from 'app/firebaseConfig.js'



export default function Home() {
  const rsvpText=useAppSelector((state)=>state.textReducer.value.text)
  

  return (
    <>
    <h1>{auth?.currentUser?.email}</h1>
    <div className="mt-4 dark:text-gray-100"><h1>{rsvpText}</h1></div>
    
    
    </>
  )
}
