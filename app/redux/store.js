import {configureStore} from '@reduxjs/toolkit'
import textReducer from './features/text-slice'; 
import { useSelector } from 'react-redux';
export const store=configureStore({
    reducer:{textReducer,},
}
);
export const useAppSelector=useSelector
