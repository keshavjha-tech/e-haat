import React from 'react'
import { LuCircleUserRound } from 'react-icons/lu';
import { CiHeart } from "react-icons/ci";
import { MdLogout } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io"
import { PiPackage } from "react-icons/pi";
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import summaryApi from '../utils/summaryApi';
import { logout } from '../store/userSlice';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';



function UserMenu() {
    const { user } = useSelector((state) => state.user)
    const dispatch = useDispatch();


    const logoutHandler = async () => {
        try {
            const response = await axiosInstance({
                ...summaryApi.logout
            })
            if (response.data.success) {
                dispatch(logout())
                toast.success(response.data.message)
            }
        } catch (error) {
            console.error("Logout Error:", error);
            console.error("Error Response:", error.response);
            const errorMessage = error.response?.data?.message || error.message || "Something went wrong!";
            AxiosToastError(errorMessage)
        }
    }
    return (
        <div className='w-full'>
            <div className='font-semibold'>Account</div>
            <div className='flex flex-col gap-3 mt-3 w-full px-2'>


                <Link className='flex gap-2 w-full text-sm hover:bg-gray-100'>
                    <LuCircleUserRound className='size-5' />
                    My Profile
                </Link>
                <Link to={'/order'} className='flex gap-2 text-sm hover:bg-slate-100'>
                    < PiPackage className='size-5' />Orders
                </Link>
                <Link to={'/wishlist'} className='flex gap-2 text-sm hover:bg-slate-100'>
                    <CiHeart className='size-5' />Wishlist
                </Link>
                <Link to={'/notification'} className='flex gap-3 text-sm hover:bg-slate-100'>
                    <IoMdNotificationsOutline className='size-5' />Notification
                </Link>
                <button onClick={logoutHandler} className='flex gap-2 text-sm hover:bg-slate-100'>
                    <MdLogout className='size-5' />Logout
                </button>
            </div>
        </div>
    )
}

export default UserMenu