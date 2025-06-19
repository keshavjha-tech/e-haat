import React from 'react'
import SearchBar from './SearchBar'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className='h-20 shadow-md sticky top-0'>
      <div className='container mx-auto h-full flex items-center  justify-around px-4 '>
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

        <div>
          <SearchBar />
        </div>

        {/* {login and cart} */}

        <div>
          login and cart
        </div>

        
      </div>
    </header>
  )
}

export default Header