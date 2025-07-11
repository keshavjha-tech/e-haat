import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import "../index.css";
import useMobile from "../hooks/useMobile";

function SearchBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchPage, setIsSearchPage] = useState(false);
  const [isMobile] = useMobile();

  useEffect(() => {
    const isSearch = location.pathname === "/search";
    setIsSearchPage(isSearch);
  }, [location]);

  const redirectToSearchPage = () => {
    navigate("/search");
  };

  // console.log("search", isSearchPage);

  return (
    <div className="w-full min-w-[300px] lg:min-w-3xl  rounded-lg overflow-hidden flex items-center lg:h-full h-10 bg-slate-100 text-neutral-500 ">
      <div>
        {isSearchPage && isMobile ? (
          <Link to={"/"} className="flex justify-center items-center h-full p-2 m-2 bg-white rounded-full shadow-md">
            <FaArrowLeft className="size-4 text-slate-500" />
          </Link>
        ) : (
          <button className="flex justify-center items-center h-full p-3">
            <IoIosSearch className="size-6 text-slate-500" />
          </button>
        )}
      </div>

      {!isSearchPage ? (
        <div onClick={redirectToSearchPage} className="w-full h-full mt-3 sm:mt-0">
          <TypeAnimation
            sequence={[
              // Same substring at the start will only be typed out once, initially
              'Search for "Products"',
              1000,
              'Search for "Brands"',
              1000,
              'Search for "Styles"',
              1000,
              'Search for "More"',
              1000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
            className="p"
          />
        </div>
      ) : (
        <div className="w-full ">
          <input
            type="text"
            placeholder="Search for Product, Brands and More"
            autoFocus={true}
            className="w-full outline-none border-gray-300 text-neutral-800"
          />
        </div>
      )}
    </div>
  );
}

export default SearchBar;
