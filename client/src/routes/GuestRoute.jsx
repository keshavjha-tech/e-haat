import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

function GuestRoute() {
    const user = useSelector(state => state.user)
    
    // If user is logged in (has user data with _id), redirect to home
    if (user?.user?._id) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}

export default GuestRoute

