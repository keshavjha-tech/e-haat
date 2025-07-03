import React from 'react'
import SearchBar from './SearchBar'
import { Link } from 'react-router-dom'
import { FaUserCircle } from "react-icons/fa";

function Header() {
  return (
    <header className='h-24 lg:h-20 lg:shadow-md sticky top-0 items-center flex  flex-col gap-2'>
      <div className='container mx-auto flex items-center justify-around px-4 '>
        {/* {Logo} */}
        <div className='h-full'>
          <div className=' h-full flex items-center '>
            <Link to='/'>
              <h1 className='text-3xl'>
                <span>e</span><span>Haat</span>
              </h1>
            </Link>
          </div>
        </div>

        {/* {Search} */}

        <div className='hidden lg:block'>
          <SearchBar />
        </div>

        {/* {login and cart} */}

        <div >
          <button className='lg:hidden'>
              <FaUserCircle size={24} />
          </button>

          <div className='hidden lg:block'>
                Login and cart
          </div>
        </div>

      </div>

      <div className='container mx-auto px-2 sm:hidden items-center'>
        <SearchBar />
      </div>
    </header>
  )
}

export default Header