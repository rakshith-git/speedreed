'use client'

import Navbar from "./navbar"

import Textbox from "./textbox"
import Topbar from "./topbar"


export default function Home() {
  
  const {render,textbox}=Textbox()
  return (
    <>
    
    
    <div className="mt-4 dark:text-gray-100"></div>
    {render}
    
    
    </>
  )
}
