import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FaRegUserCircle } from "react-icons/fa";
import UserProfileAvatar from './components/UserProfileAvatar';


function UserProfilePage() {
  const user = useSelector(state => state?.user?.user)
  const [editAvatar, setEditAvatar] = useState(false)
  // console.log("Profile", user)
  const [userData, setUserData] = useState({
    name: user?.name,
    email: user?.email,
    mobile: user?.mobile
  });

  useEffect(() => {
    setUserData({
      name: user?.name,
      email: user?.email,
      mobile: user?.mobile
    })
  }, [user])

  const changeHandler = (e) => {
    const { name, value } = e.target

    setUserData((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const submitHandler = ()=>{
    e.preventDefault
    
  }
  return (
    <div>
      <div className='w-16 h-16 flex items-center justify-center rounded-full overflow-hidden '>
        {
          user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className='w-full h-full' />
          ) : (<FaRegUserCircle size={50} />)
        }
      </div>
      <button onClick={() => setEditAvatar(true)} className='min-w-16 text-sm px-3 py-1 rounded-full mt-2'>edit</button>

      {
        editAvatar && (<UserProfileAvatar
          close={() => setEditAvatar(false)} />)
      }

      {/** Details editing */}
      <form className='my-4 grid gap-4' >
        <div className='grid'>
          <label>Name</label>
          <input
            type='text'
            placeholder='Enter your name'
            className='p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded'
            value={user?.name}
            name='name'
            onChange={changeHandler}
            required
          />
        </div>
        <div className='grid'>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            placeholder='Enter your email'
            className='p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded'
            value={user?.email}
            name='email'
            onChange={changeHandler}
            required
          />
        </div>
        <div className='grid'>
          <label htmlFor='mobile'>Mobile</label>
          <input
            type='text'
            id='mobile'
            placeholder='Enter your mobile'
            className='p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded'
            value={user?.mobile}
            name='mobile'
            onChange={changeHandler}
            required
          />
        </div>

        <button className='border px-4 py-2 font-semibold hover:bg-primary-100 border-primary-100 text-primary-200 hover:text-neutral-800 rounded'>
          {
            // loading ? "Loading..." : "Submit"
          }
        </button>
      </form>

    </div>
  )
}

export default UserProfilePage