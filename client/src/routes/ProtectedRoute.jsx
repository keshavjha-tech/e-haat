import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, } from 'react-router-dom'

function ProtectedRoute({ roles }) {
    const user = useSelector(state => state.user)
    
    if(!user){
        return <Navigate to="/login" replace />
    }

    if(roles && !roles.includes(user.role)){
        return <Navigate to="/" replace />
    }

  return <Outlet />
}

export default ProtectedRoute