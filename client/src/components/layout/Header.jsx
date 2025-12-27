import React, { useState, useEffect } from "react";
import SearchBar from "../SearchBar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaAngleUp, FaUserCircle } from "react-icons/fa";
import { BsCart3, BsBag } from "react-icons/bs";
import { LuCircleUserRound } from "react-icons/lu";
import useMobile from "../../hooks/useMobile";
import { useSelector } from "react-redux"
import { FaAngleDown } from "react-icons/fa";
import UserMenu from "../../features/user/components/UserMenu";
import { useCartCount } from "../../hooks/useCartCount";

function Header() {
  const [isMobile] = useMobile();
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";
  const navigate = useNavigate();
  const [openUserMenu, setOpenUserMenu] = useState(false)
  const user = useSelector((state) => state?.user)
  const { cartCount } = useCartCount();

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
          <div className="h-full flex-shrink-0">
            <div className="h-full flex items-center">
              <Link to="/" className="group flex items-center">
                <div className="relative flex items-center gap-2 sm:gap-2.5">
                  {/* Logo Icon with background */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300"></div>
                    <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-1.5 sm:p-2 rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-sm">
                      <BsBag className="text-white text-lg sm:text-xl lg:text-2xl" />
                    </div>
                  </div>
                  {/* Logo Text */}
                  <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight">
                    <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] group-hover:bg-[position:100%_center] transition-all duration-500">
                      e
                    </span>
                    <span className="text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      Haat
                    </span>
                  </h1>
                </div>
              </Link>
            </div>
          </div>

          {/* {Search} */}

          <div className="hidden lg:block">
            <SearchBar />
          </div>

          {/* {login and cart} */}

          <div className="flex items-center gap-3 lg:gap-0">
            {/* For mobile version - Cart */}
            <Link to="/cart" className="lg:hidden relative">
              <BsCart3 className="size-7" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
            {/* For mobile version - User */}
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


              <Link to="/cart" className="relative flex items-center gap-2 hover:text-blue-600 transition-colors">
                {/* cart icon */}
                <div className="relative">
                  <BsCart3 size={24} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </div>
                <div>
                  <p>Cart</p>
                </div>
              </Link>
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
