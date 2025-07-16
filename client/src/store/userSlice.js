import { createSlice } from "@reduxjs/toolkit";

export const storedAuthData = ()=>{
    try {
        const storedUser = localStorage.getItem("loggedInUser")

        if(!storedUser ||  storedUser === "undefined" || storedUser === "null"){
            return null;
        }
        return JSON.parse(storedUser);
            
    } catch (error) {
        console.error("Error parsing stored auth data:", error);
    }
}
const initialState = {
   user: storedAuthData()
}

const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {
        setUser : (state, action) =>{
           state.user = action.payload
        },
        logout: (state, action) => {
            state.user = null;
            localStorage.clear()
        }
    }
})

export const {setUser, logout} = userSlice.actions

export default userSlice.reducer