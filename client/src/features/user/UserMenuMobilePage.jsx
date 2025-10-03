import React from 'react'
import UserMenu from './components/UserMenu'
import { FaArrowLeft } from "react-icons/fa";
import { Link } from 'react-router-dom';
import UserDashboardMenu from './components/UserDashboardMenu';

function UserMenuMobilePage() {
  return (
    <div className='bg-white h-screen'>
      <div className='p-4 border-b flex items-center gap-4'>
        <Link to={"/"}>
        <FaArrowLeft />
        </Link>
        <h1 className='font-bold text-lg'>My Account</h1>
      </div>
      <div className='p-2'>
        <UserDashboardMenu />
      </div>
    </div>
  )
}

export default UserMenuMobilePage