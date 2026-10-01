import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/config/redux/reducer/authReducer";
import postReducer from "@/config/redux/reducer/postReducer";

/**
 * 
 * STEPS for State Management
 * Submit Action
 * Handle action in it's reducer
 * Register Here -> Reducer
 * 
 */

export const store = configureStore({
    reducer: {
        auth: authReducer,
        postReducer: postReducer,
    },
});