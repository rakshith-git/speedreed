"use client";
import Link from "next/link";
import React, { useState,useEffect } from "react";
import Tesseract from "tesseract.js";
import {resetText,setRSVPText} from "app/redux/features/text-slice.js"
import {useDispatch} from 'react-redux'
import { useAppSelector } from "app/redux/store.js";
import { auth } from "./firebaseConfig";
function Textbox() {
  const [fileText, setFileText] = useState("");
  const [searchTerm, setsearchTerm] = useState("");
  const [textBox, settextBox] = useState("");
  const rsvpText = useAppSelector((state) => state.textReducer.value.text);
  const dispatch=useDispatch();
  useEffect(() => {
    const timer = setTimeout(() => {
      settextBox(rsvpText)
    }, 400);

    return () => clearTimeout(timer);
  }, []);
  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        setFileText(text);
        settextBox(text);
        console.log(fileText);
      };
      reader.readAsText(file);
    } else {
      setFileText("Invalid file. Please upload a .txt file.");
    }
  };

  useEffect(() => {
    dispatch(setRSVPText(textBox))
    
  }, [textBox])
  

  const handleImageUpload = (event) => {
    console.log(event.target.files);
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const imageContent = e.target.result;
      extractTextFromImage(imageContent);
    };

    reader.readAsDataURL(file);
  };

  const extractTextFromImage = (imageContent) => {
    Tesseract.recognize(imageContent, "eng")
      .then((result) => {
        const extractedText = result.data.text;
        settextBox(extractedText);
      })
      .catch((error) => {
        console.error("Error during OCR:", error);
      });
  };

  async function fetchWikipediaData(searchTerm) {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&generator=search&gsrnamespace=0&gsrlimit=1&gsrsearch=${searchTerm}&origin=*`
    );
    console.log(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(
        searchTerm
      )}&origin=*`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();

    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];

    if (pageId === "-1") {
      console.log("No Wikipedia page found for the given search term.");
      return null;
    }

    const pageContent = pages[pageId].extract;
    return pageContent;
  }

  const handleSearch = async () => {
    fetchWikipediaData(searchTerm)
      .then((pageContent) => {
        console.log(`Wikipedia page content for ${searchTerm}:`, pageContent);
        settextBox(pageContent);
        console.log(textBox);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  return {
    textBox,
    render:(<>
      
      <div className="flex justify-center ">
        <div className="w-11/12 mb-4 border  border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 ">
          <div className="flex items-center justify-between px-3 py-2 border-b dark:border-gray-600">
            <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x dark:divide-gray-600">
              <div className="flex items-center space-x-1 sm:pr-4">
              <form className="flex items-center">
                  
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="simple-search"
                      onChange={(e) => {
                        setsearchTerm(e.target.value);
                      }}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Search Wiki"
                      required=""
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <span className="sr-only">Search</span>
                  </button>
                </form>
                <input
                  type="file"
                  id="fileInput"
                  accept=".txt"
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                />
                <label
                  htmlFor="fileInput"
                  className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Attach file</span>
                </label>
                <input
                  type="file"
                  id="imgInput"
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <label
                  htmlFor="imgInput"
                  className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Upload image</span>
                </label>
                <button
                  type="button"
                  className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Format code</span>
                </button>
              </div>
              <div className="flex flex-wrap items-center space-x-1 sm:pl-4">
                {/* <button
                  type="button"
                  className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Settings</span>
                </button> */}
                
              </div>
            </div>
            
          </div>
          <div className="px-4 py-2 bg-white rounded-b-lg dark:bg-gray-800">
           
            <textarea
              id="editor"
              rows={8}
              className="block w-full px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
              placeholder="Place Your Text Here..."
              required=""
              value={textBox}
              onChange={(e) => settextBox(e.target.value)}
            />
          </div>
        </div>
      </div>


    </>)
  
              }
}

export default Textbox;
