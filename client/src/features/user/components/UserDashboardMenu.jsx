import React from 'react'
import { LuCircleUserRound } from 'react-icons/lu';
import { CiHeart } from "react-icons/ci";
import { MdLogout } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io"
import { GiPowerButton } from "react-icons/gi";
import { PiPackage } from "react-icons/pi";
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';
import summaryApi from '../../../api/summaryApi';
import { logout } from '../../../store/userSlice';
import toast from 'react-hot-toast';
import AxiosToastError from '../../../api/AxiosToastError';



function UserDashboardMenu() {
    const {user } = useSelector((state) => state?.user)
    const dispatch = useDispatch();
    const navigate = useNavigate()


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
        <div className='w-full'>
            <div>
                <div></div>
                <div>
                    <p>Hello</p>
                    <h3>{user.user.name}</h3>
                </div>
            </div>
            <div></div>
            <div></div>
        </div>
    )
}

export default UserDashboardMenu