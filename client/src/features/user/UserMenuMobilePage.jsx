import React from 'react'
import UserMenu from './components/UserMenu'
import { FaArrowLeft } from "react-icons/fa";

function UserMenuMobilePage() {
  return (
    <section className='bg-white h-full w-full flex items-center justify-center'>
      <button onClick={()=>window.history.back()} className='m-4 my-3 py-4'><FaArrowLeft/></button>
        <div className='container mx-auto p-3 flex items-center justify-center mt-28'>
            <UserMenu />
        </div>
    </section>
  )
}

export default UserMenuMobilePage