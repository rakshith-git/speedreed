import {createSlice} from '@reduxjs/toolkit' 
const initialState={
    value:{
        text:""
    }
}
export const text =createSlice({
    name:"text",
    initialState:initialState,
    reducers:{
        resetText:()=>{return initialText},
        setRSVPText:(state,action)=>{
            return{
                value:{text: action.payload}
            }

        },
        getText:()=>{return text}
    }
})

export const {resetText,setRSVPText}=text.actions;
export default text.reducer;

