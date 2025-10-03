import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaRegUserCircle } from "react-icons/fa";
import UserProfileAvatar from './components/UserProfileAvatar';
import axiosInstance from '@/api/axiosInstance';
import summaryApi from '@/api/summaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '@/api/AxiosToastError';
import { setUser } from '@/store/userSlice';
import fetchUserDeatil from '@/api/fetchUserDetail';
import useMobile from '@/hooks/useMobile';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';


function UserProfilePage() {
  const user = useSelector(state => state?.user)
  const dispatch = useDispatch()
  const [isMobile] = useMobile()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    mobile: ''
  });

  useEffect(() => {
    if (user?.user) {
      setFormData({
        name: user?.user?.name,
        email: user?.user?.email,
        mobile: user?.user?.mobile
      })
    }
  }, [user])

  const changeHandler = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({

      ...prev,
      [name]: value

    }))
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const res = await axiosInstance({
        ...summaryApi.update,
        data: formData
      })

      if (res.data.error) {
        toast.error(res.data.error)
      }

      if (res.data.success) {
        toast.success(res.data.message)

        setIsEditing(null)

        // const userData = await fetchUserDeatil();
        // dispatch(setUser(userData))

        const userData = res?.data?.data
        dispatch(setUser(userData))

      }
      console.log("response", res);
    } catch (error) {
      AxiosToastError(error)
    }



  }
  return (

    <div> 
    {
      isMobile && (
      <div className='p-4 border-b flex items-center gap-4'>
        <button onClick={() => navigate(-1)}>
        <FaArrowLeft />
        </button>
        
        </div>
    )
    }

<div className='grid grid-cols-1 gap-8'>

  {/* Name */}
  <div>
    <div className='flex items-center gap-6 mb-3'>
      <h2 className='text-xl font-semibold'>Personal Information</h2>
      {
        isEditing !== "name" && (
          <button onClick={() => {
            setFormData(prev => ({ ...prev, name: user?.user?.name })); setIsEditing("name")
          }} className='text-blue-600 text-sm font-semibold'>Edit</button>
        )
      }
    </div>

    {/* Name Field */}
    <div className='flex items-center gap-4'>
      <div >
        <label className="text-sm text-gray-500">Name</label>
        {isEditing === "name" ? (
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={changeHandler}
            className='w-full p-2 border rounded-md mt-1' />
        ) : (
          <p className='font-medium mt-1'> {user?.user?.name}</p>
        )}
      </div>

      {isEditing === "name" && (
        <div className="mt-8 flex gap-4">
          <button onClick={submitHandler} className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold">
            Save
          </button>
          <button onClick={() => setIsEditing(null)} className="bg-gray-200 px-4 py-2 rounded-md">
            Cancel
          </button>
        </div>
      )}

    </div>
  </div>

  {/* Email */}
  <div>
    <h2 className='text-xl font-semibold mt-6'>Email Address</h2>
    <p className='font-medium text-gray-400 mt-1'> {user?.user?.email} </p>
  </div>

  {/* Mobile */}
  <div>
    <div className='flex items-center gap-6 mt-8 mb-3'>
      <h2 className='text-xl font-semibold'>Mobile</h2>
      {
        isEditing !== "mobile" && (
          <button onClick={() => {
            setFormData(prev => ({ ...prev, mobile: user?.user?.mobile })); setIsEditing("mobile")
          }} className='text-blue-600 text-sm font-semibold'>Edit</button>
        )
      }
    </div>

    <div className='flex items-center gap-4'>
      <div >
        {isEditing === "mobile" ? (
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={changeHandler}
            className='w-full p-2 border rounded-md mt-1' />
        ) : (
          <p className='font-medium mt-1'> {user?.user?.mobile}</p>
        )}
      </div>

      {isEditing === "mobile" && (
        <div className="mt-3 flex gap-4">
          <button onClick={submitHandler} className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold">
            Save
          </button>
          <button onClick={() => setIsEditing(null)} className="bg-gray-200 px-4 py-2 rounded-md">
            Cancel
          </button>
        </div>
      )}

    </div>
  </div>
</div>
</div>

  )
}

export default UserProfilePage