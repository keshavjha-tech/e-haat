import React from 'react'
import { LuCircleUserRound } from 'react-icons/lu';
import { CiHeart } from "react-icons/ci";
import { MdArrowRight, MdLogout } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io"
import { GiPowerButton } from "react-icons/gi";
import { PiPackage } from "react-icons/pi";
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';
import summaryApi from '../../../api/summaryApi';
import { logout } from '../../../store/userSlice';
import toast from 'react-hot-toast';
import AxiosToastError from '../../../api/AxiosToastError';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { IoPowerSharp } from "react-icons/io5";
import { ChevronRight, PackageOpen } from 'lucide-react';



function UserDashboardMenu() {
    const { user } = useSelector(state => state?.user)
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const activeLinkClass = "bg-blue-50 text-blue-600 font-semibold";

    const logoutHandler = async () => {
        try {
            const response = await axiosInstance({
                ...summaryApi.logout
            })
            if (response.data.success) {
                dispatch(logout())
                localStorage.clear()
                toast.success(response.data.message)
                navigate("/")
            }
        } catch (error) {
            console.error("Logout Error:", error);
            console.error("Error Response:", error.response);
            const errorMessage = error.response?.data?.message || error.message || "Something went wrong!";
            AxiosToastError(errorMessage)
        }
    }
    return (

        <div className='bg-white p-4 rounded-l-2xl shadow-sm'>
            <div className='flex items-center gap-4 pb-4 border-b'>
                <div className='flex items-center justify-center'>
                    <Avatar className='size-12'>
                        <AvatarImage src="/avatar.svg" />
                    </Avatar>
                </div>
                <div className='flex flex-col gap-1'>
                    <p className='text-xs text-gray-600'>Hello,</p>
                    <h4 className='font-semibold'>{user?.name}</h4>
                </div>
            </div>

            <div className='mt-3 items-center pb-4 border-b'>
                <NavLink to={"/orders"} className={'flex items-center gap-3 px-3 py-2 text-gray-400 uppercase'}>
                    <PackageOpen className='text-blue-600'/> <span className='hover:text-blue-600 font-semibold'>My Orders</span>
                    <ChevronRight className='text-gray-500 ml-[27px] '/>
                </NavLink>

            </div>

            <nav className="mt-6 flex flex-col gap-2 pb-4 border-b">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">Account Settings</h4>
                <NavLink to="/dashboard/profile" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md ${isActive && activeLinkClass}`}>
                    <LuCircleUserRound /> Profile Information
                </NavLink>
                {/* Add other links similarly */}
                <NavLink to="/dashboard/addresses" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md ${isActive && activeLinkClass}`}>
                    <PiPackage /> Manage Addresses
                </NavLink>
                <NavLink to="/dashboard/wishlist" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md ${isActive && activeLinkClass}`}>
                    <CiHeart /> My Wishlist
                </NavLink>
            </nav>

            <button onClick={logoutHandler} className='flex gap-2 mt-6 px-3  mb-2 text-gray-500 font-semibold hover:text-bg-blue-700 cursor-pointer'>
                <IoPowerSharp className='size-5 mt-0.5 text-blue-700' />Logout
            </button>
        </div>
    )
}

export default UserDashboardMenu