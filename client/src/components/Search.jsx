import React, { useEffect, useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { FaArrowLeft } from 'react-icons/fa';
import useMobile from '../hooks/useMobile';

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchPage, setIsSearchPage] = useState(false);
  const [isMobile] = useMobile();
  const params = useLocation();
  const searchText = params.search.slice(3);

  useEffect(() => {
    const isSearch = location.pathname === '/search';
    setIsSearchPage(isSearch);
  }, [location]);

  const redirectToSearchPage = () => {
    navigate('/search');
  };

  const handleOnChange = (e) => {
    const value = e.target.value;
    const url = `/search?q=${value}`;
    navigate(url);
  };

  return (
    <div className="w-full min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-xl border-2 border-theme-200 overflow-hidden flex items-center text-gray-500 bg-white group focus-within:border-theme-500 focus-within:shadow-lg transition-all duration-300">
      <div>
        {isMobile && isSearchPage ? (
          <Link
            to={'/'}
            className="flex justify-center items-center h-full p-2 m-1 group-focus-within:text-theme-600 bg-gradient-to-r from-theme-100 to-theme-200 hover:from-theme-200 hover:to-theme-300 rounded-full shadow-md transition-all duration-200"
          >
            <FaArrowLeft size={20} />
          </Link>
        ) : (
          <button className="flex justify-center items-center h-full p-3 group-focus-within:text-theme-600 hover:text-theme-500 transition-colors duration-200">
            <IoSearch size={22} />
          </button>
        )}
      </div>
      <div className="w-full h-full">
        {!isSearchPage ? (
          //not in search page
          <div
            onClick={redirectToSearchPage}
            className="w-full h-full flex items-center cursor-pointer hover:bg-theme-50 transition-colors duration-200 px-2"
          >
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
                'Search "milk"',
                1000, // wait 1s before replacing "Mice" with "Hamsters"
                'Search "bread"',
                1000,
                'Search "sugar"',
                1000,
                'Search "paneer"',
                1000,
                'Search "chocolate"',
                1000,
                'Search "curd"',
                1000,
                'Search "rice"',
                1000,
                'Search "egg"',
                1000,
                'Search "chips"',
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="text-gray-600"
            />
          </div>
        ) : (
          //when i was search page
          <div className="w-full h-full px-2">
            <input
              type="text"
              placeholder="Search for groceries, snacks and more..."
              autoFocus
              defaultValue={searchText}
              className="bg-transparent w-full h-full outline-none text-gray-700 placeholder-gray-400"
              onChange={handleOnChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
