import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaRegUserCircle, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";
import axiosInstance from '@/api/axiosInstance';
import summaryApi from '@/api/summaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '@/api/AxiosToastError';
import { setUser } from '@/store/userSlice';
import useMobile from '@/hooks/useMobile';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';

function UserProfilePage() {
  const user = useSelector(state => state?.user)
  const dispatch = useDispatch()
  const [isMobile] = useMobile()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    mobile: ''
  });
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (user?.user) {
      setFormData({
        name: user?.user?.name || '',
        mobile: user?.user?.mobile || ''
      })
    }
  }, [user])

  const validateField = (name, value) => {
    const newErrors = { ...errors }
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Name is required'
        } else if (value.trim().length < 2) {
          newErrors.name = 'Name must be at least 2 characters'
        } else {
          delete newErrors.name
        }
        break
      case 'mobile':
        if (!value.trim()) {
          newErrors.mobile = 'Mobile number is required'
        } else if (!/^\d{10}$/.test(value.trim())) {
          newErrors.mobile = 'Mobile number must be 10 digits'
        } else {
          delete newErrors.mobile
        }
        break
      default:
        break
    }
    
    setErrors(newErrors)
    return !newErrors[name]
  }

  const changeHandler = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
    
    // Validate on change
    if (isEditing === name) {
      validateField(name, value)
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    
    // Validate before submitting
    if (!validateField(isEditing, formData[isEditing])) {
      return
    }

    try {
      setLoading(true)
      const res = await axiosInstance({
        ...summaryApi.update,
        data: formData
      })

      if (res.data.error) {
        toast.error(res.data.error)
        return
      }

      if (res.data.success || res.data.statusCode === 200) {
        toast.success(res.data.message || 'Profile updated successfully')
        setIsEditing(null)
        setErrors({})
        
        const userData = res?.data?.data || res?.data?.user
        if (userData) {
          dispatch(setUser(userData))
        } else {
          // Fetch updated user details
          const userDetailRes = await axiosInstance({
            ...summaryApi.userDetails
          })
          if (userDetailRes?.data?.statusCode === 200) {
            dispatch(setUser(userDetailRes.data.data))
          }
        }
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (field) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: user?.user?.[field] || '' 
    }))
    setIsEditing(field)
    setErrors({})
  }

  const handleCancel = () => {
    setIsEditing(null)
    setFormData({
      name: user?.user?.name || '',
      mobile: user?.user?.mobile || ''
    })
    setErrors({})
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      {/* Mobile Header */}
      {isMobile && (
        <div className='p-4 border-b flex items-center gap-4 mb-6'>
          <button onClick={() => navigate(-1)} className='hover:text-blue-600 transition-colors'>
            <FaArrowLeft className='text-xl' />
          </button>
          <h1 className='text-xl font-bold'>Profile Information</h1>
        </div>
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Profile Information</h1>
          <p className='text-gray-600'>Manage your personal information and preferences</p>
        </div>
      )}

      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 space-y-8'>
        {/* Avatar Section */}
        <div className="flex items-center gap-6 pb-8 border-b border-gray-200">
          <div className="relative">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-4xl md:text-5xl font-bold shadow-lg">
              {user?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            {user?.user?.avatar && (
              <img 
                src={user?.user?.avatar} 
                alt={user?.user?.name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover absolute inset-0"
              />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
              {user?.user?.name || 'User'}
            </h2>
            <p className="text-gray-600 flex items-center gap-2">
              <MdEmail className="text-sm" />
              {user?.user?.email}
            </p>
          </div>
        </div>

        {/* Name Field */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Full Name
              </label>
              {isEditing === "name" ? (
                <div className="mt-2 space-y-2">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={changeHandler}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                    autoFocus
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>
              ) : (
                <p className='text-lg font-medium text-gray-900 mt-1'>
                  {user?.user?.name || 'Not set'}
                </p>
              )}
            </div>
            {isEditing !== "name" && (
              <button
                onClick={() => handleEdit("name")}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
              >
                <FaEdit className="text-sm" />
                Edit
              </button>
            )}
          </div>

          {isEditing === "name" && (
            <div className="flex gap-3">
              <button
                onClick={submitHandler}
                disabled={loading || !!errors.name}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaCheck />
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                <FaTimes />
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Email Field (Read-only) */}
        <div className="space-y-2 pt-4 border-t border-gray-200">
          <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Email Address
          </label>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <MdEmail className="text-gray-500 text-xl" />
            <p className='text-lg font-medium text-gray-900'>
              {user?.user?.email}
            </p>
          </div>
          <p className="text-xs text-gray-500">Email cannot be changed</p>
        </div>

        {/* Mobile Field */}
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Mobile Number
              </label>
              {isEditing === "mobile" ? (
                <div className="mt-2 space-y-2">
                  <div className="relative">
                    <MdPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={changeHandler}
                      className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        errors.mobile ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter 10-digit mobile number"
                      maxLength={10}
                      autoFocus
                    />
                  </div>
                  {errors.mobile && (
                    <p className="text-sm text-red-500">{errors.mobile}</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3 mt-1">
                  <MdPhone className="text-gray-500" />
                  <p className='text-lg font-medium text-gray-900'>
                    {user?.user?.mobile || 'Not set'}
                  </p>
                </div>
              )}
            </div>
            {isEditing !== "mobile" && (
              <button
                onClick={() => handleEdit("mobile")}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
              >
                <FaEdit className="text-sm" />
                {user?.user?.mobile ? 'Edit' : 'Add'}
              </button>
            )}
          </div>

          {isEditing === "mobile" && (
            <div className="flex gap-3">
              <button
                onClick={submitHandler}
                disabled={loading || !!errors.mobile}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaCheck />
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                <FaTimes />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfilePage
