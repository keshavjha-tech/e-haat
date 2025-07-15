import { createSlice } from "@reduxjs/toolkit";
import fetchUserDeatil from "../utils/fetchUserDetail";

export const loggedInUser = ()=>{
    try {
        const storedUser = fetchUserDeatil();

        if(!storedUser ||  storedUser === "undefined" || storedUser === "null"){
            return null;
        }
        return JSON.parse(storedUser);
            
    } catch (error) {
        console.error("Error parsing stored auth data:", error);
    }
}
const initialState = {
   user: loggedInUser() 
}

const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {
        setUser : (state, action) =>{
           state.user = action.payload
        }
    }
})

export const {setUser} = userSlice.actions

export default userSlice.reducer