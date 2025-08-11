import React, { useState } from "react";
import SearchBar from "../SearchBar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaAngleUp, FaUserCircle } from "react-icons/fa";
import { BsCart3 } from "react-icons/bs";
import { LuCircleUserRound } from "react-icons/lu";
import useMobile from "../../hooks/useMobile";
import { useSelector } from "react-redux"
import { FaAngleDown } from "react-icons/fa";
import UserMenu from "../UserMenu";

function Header() {
  const [isMobile] = useMobile();
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";
  const navigate = useNavigate();
  const [openUserMenu, setOpenUserMenu] = useState(false)
  const user = useSelector((state) => state?.user)

  // console.log('user from redux-store', user)

  const redirectToLoginPage = () => {
    navigate("/login")
  }

 const mobileUserHandler = () => {
  if( !user?.user?._id){
    navigate("/login")
    return
  }
  navigate("/user-menu")
 }

  // console.log("location", location);
  // console.log('ismobile', isMobile);
  // console.log("isSearchPage", isSearchPage);
  return (
    <header className="h-24 lg:h-20 lg:shadow-md sticky top-0 z-40 items-center flex  flex-col gap-2 justify-center bg-white">
      {!(isSearchPage && isMobile) && (
        <div className="container mx-auto flex items-center justify-around px-4 ">
          {/* {Logo} */}
          <div className="h-full">
            <div className=" h-full flex items-center ">
              <Link to="/">
                <h1 className="text-3xl">
                  <span>e</span>
                  <span>Haat</span>
                </h1>
              </Link>
            </div>
          </div>

          {/* {Search} */}

          <div className="hidden lg:block">
            <SearchBar />
          </div>

          {/* {login and cart} */}

          <div>
            {/* For mobile version  */}
            <button onClick={mobileUserHandler} className="lg:hidden">
              <FaUserCircle  className="size-7 pt-1"/>
            </button>

            {/* For Desktop */}

            <div className="hidden lg:flex items-center gap-7">
              {
                user?.user?._id ? (
                  <div className="relative cursor-pointer">
                    <div
                      onMouseEnter={() => setOpenUserMenu(true)}
                      onMouseLeave={() => setOpenUserMenu(false)}
                      className="flex items-center gap-1 px-3 py-2 rounded transition-all duration-200 ease-in-out group-hover:bg-gray-100">
                      <p className="transition-colors duration-200">{user.user.name}</p>

                      {
                        openUserMenu ? (<FaAngleUp className="text-lg mt-1 transition-transform duration-200" />)
                          : (<FaAngleDown className="text-lg mt-1 transition-transform duration-200" />)
                      }


                    </div>
                    {
                      openUserMenu && (
                        <div className="absolute top-10 w-full z-10 animate-fadeInSlideDown"
                          onMouseEnter={() => setOpenUserMenu(true)}
                          onMouseLeave={() => setOpenUserMenu(false)}>
                          <div className="bg-white rounded p-4 w-48 shadow-lg">
                            <UserMenu />
                          </div>
                        </div>)
                    }
                  </div>
                ) : (<button onClick={redirectToLoginPage} className="flex gap-1 px-2 "> <LuCircleUserRound className="size-6 " />Login</button>)
              }


              <button className="flex items-center gap-2">
                {/* cart icon */}
                <div>
                  <BsCart3 size={24} />
                </div>
                <div>
                  <p>cart</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-2 lg:hidden items-center">
        <SearchBar />
      </div>
    </header>
  );
}

export default Header;
