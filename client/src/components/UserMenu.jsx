import React from 'react'
import { LuCircleUserRound } from 'react-icons/lu'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

function UserMenu() {
    const user = useSelector((state) => state.user)
    return (
        <div>
            <div className='font-semibold'>Account</div>
            <div className='flex flex-col gap-3 mt-3'>
                {/* <ul>
            <li className='flex gap-3 text-sm' > <LuCircleUserRound className='size-5' /> <span> My Profile</span></li>
            <li className='flex gap-3 text-sm' > <LuCircleUserRound className='size-5' /> <span> My Profile</span></li>
            <li className='flex gap-3 text-sm' > <LuCircleUserRound className='size-5' /> <span> My Profile</span></li>
            <li className='flex gap-3 text-sm' > <LuCircleUserRound className='size-5' /> <span> My Profile</span></li>
            <li className='flex gap-3 text-sm' > <LuCircleUserRound className='size-5' /> <span> My Profile</span></li>
            
        </ul> */}

                <Link className='flex gap-2 text-sm hover:bg-amber-50'>
                    <LuCircleUserRound className='size-5' />
                    My Profile
                </Link>
                <Link to={'/order'} className='flex gap-2 text-sm'>
                    <LuCircleUserRound className='size-5' />Orders
                </Link>
                <Link to={'/wishlist'} className='flex gap-2 text-sm'>
                    <LuCircleUserRound className='size-5' />Wishlist
                </Link>
                <Link to={'/notification'} className='flex gap-3 text-sm'>
                    <LuCircleUserRound className='size-5' />Notification
                </Link>
                <Link to={'/logout'} className='flex gap-2 text-sm'>
                    <LuCircleUserRound className='size-5' />Logout
                </Link>
            </div>
        </div>
    )
}

export default UserMenu