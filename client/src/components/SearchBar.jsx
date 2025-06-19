import React, { useEffect, useState } from 'react'
import { IoIosSearch } from "react-icons/io";
import { useLocation, useNavigate } from 'react-router-dom';


function SearchBar() {

    const navigate = useNavigate();
    const location = useLocation();
    const [isSearchPage, setIsSearchPage] = useState(false)

    useEffect(() => {
        const isSearch = location.pathname === '/search';
        setIsSearchPage(isSearch);
    }, [location])


    const redirectToSearchPage = () => {
        navigate("/search")
    }

    console.log('search', isSearchPage)

    return (
        <div className='w-full min-w-[300px] lg:min-w-3xl rounded-lg overflow-hidden flex items-center h-full bg-slate-100'>
            <button className='flex justify-center items-center h-full p-3'>
                <IoIosSearch className='size-6 text-slate-500' />
            </button>

            {
                !isSearchPage ? (
                    <div className='w-full' onClick={redirectToSearchPage}>
                        <input type="text"
                            placeholder='Search for Product, Brands and More'
                            className='w-full focus:outline-none border-gray-300' />
                    </div>) :
                    (
                <div> </div>
            )
            }

        </div>
    )
}

export default SearchBar