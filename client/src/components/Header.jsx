import React, { useEffect, useState, useRef } from 'react';
import Search from './Search';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaRegCircleUser } from 'react-icons/fa6';
import { MdStorefront } from 'react-icons/md';
import useMobile from '../hooks/useMobile';
import { BsCart4 } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { GoTriangleDown, GoTriangleUp } from 'react-icons/go';
import UserMenu from './UserMenu';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { useGlobalContext } from '../provider/GlobalProvider';
import DisplayCartItem from './DisplayCartItem';

const Header = () => {
  const [isMobile] = useMobile();
  const location = useLocation();
  const isSearchPage = location.pathname === '/search';
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const cartItem = useSelector((state) => state.cartItem.cart);
  const { totalPrice, totalQty } = useGlobalContext();
  const [openCartSection, setOpenCartSection] = useState(false);
  const userMenuRef = useRef(null);

  const redirectToLoginPage = () => {
    navigate('/login');
  };

  const handleCloseUserMenu = () => {
    setOpenUserMenu(false);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setOpenUserMenu(false);
      }
    };

    if (openUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openUserMenu]);

  const handleMobileUser = () => {
    if (!user._id) {
      navigate('/login');
      return;
    }

    navigate('/user');
  };

  //total item and total price
  // useEffect(()=>{
  //     const qty = cartItem.reduce((preve,curr)=>{
  //         return preve + curr.quantity
  //     },0)
  //     setTotalQty(qty)

  //     const tPrice = cartItem.reduce((preve,curr)=>{
  //         return preve + (curr.productId.price * curr.quantity)
  //     },0)
  //     setTotalPrice(tPrice)

  // },[cartItem])

  return (
    <header className="h-24 lg:h-20 lg:shadow-lg sticky top-0 z-40 flex flex-col justify-center gap-1 bg-gradient-to-r from-white via-theme-50 to-theme-100 backdrop-blur-sm border-b border-theme-200">
      {!(isSearchPage && isMobile) && (
        <div className="container mx-auto flex items-center px-2 justify-between">
          {/**logo */}
          <div className="h-full">
            <Link to={'/'} className="h-full flex justify-center items-center">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <MdStorefront className="text-3xl lg:text-4xl text-theme-500" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full animate-pulse"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl lg:text-3xl font-bold text-theme-500">
                    Pakiza
                  </span>
                  <span className="text-xs font-medium text-gray-600 -mt-1 hidden lg:block">
                    Fast Delivery
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/**Search */}
          <div className="hidden lg:block">
            <Search />
          </div>

          {/**login and my cart */}
          <div className="">
            {/**user icons display in only mobile version**/}
            <button
              className="text-neutral-600 lg:hidden"
              onClick={handleMobileUser}
            >
              <FaRegCircleUser size={26} />
            </button>

            {/**Desktop**/}
            <div className="hidden lg:flex items-center gap-4">
              {user?._id ? (
                <div className="relative" ref={userMenuRef}>
                  <div
                    onClick={() => setOpenUserMenu((preve) => !preve)}
                    className="flex select-none items-center gap-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-theme-50 transition-all duration-200 border border-transparent hover:border-theme-200"
                  >
                    <FaRegCircleUser size={20} className="text-theme-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {user.name || 'My Account'}
                    </span>
                    {openUserMenu ? (
                      <GoTriangleUp size={16} className="text-gray-500" />
                    ) : (
                      <GoTriangleDown size={16} className="text-gray-500" />
                    )}
                  </div>
                  {openUserMenu && (
                    <div className="absolute right-0 top-14 z-50">
                      <div className="bg-white rounded-xl shadow-2xl border border-gray-100 min-w-72 overflow-hidden backdrop-blur-sm">
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-theme-50 to-theme-100 p-4 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-theme-500 rounded-full flex items-center justify-center">
                              <FaRegCircleUser
                                size={18}
                                className="text-white"
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800 text-sm">
                                {user.name || 'User Account'}
                              </h3>
                              <p className="text-xs font-medium text-gray-600">
                                {user.email || user.mobile}
                                {user.role === 'ADMIN' && (
                                  <span className="ml-2 px-2 py-0.5 bg-theme-500 text-white text-xs font-medium rounded-full">
                                    Admin
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                          <UserMenu close={handleCloseUserMenu} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={redirectToLoginPage}
                  className="px-4 py-2 text-sm font-medium text-theme-600 border border-theme-200 rounded-lg hover:bg-theme-50 hover:border-theme-300 transition-all duration-200"
                >
                  Sign In
                </button>
              )}

              {/* Hide cart button for admin users and non-logged in users */}
              {user?._id && user?.role !== 'ADMIN' && (
                <button
                  onClick={() => setOpenCartSection(true)}
                  className="flex items-center gap-2 bg-theme-gradient hover:bg-theme-600 px-3 py-2 rounded-lg text-white shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  {/**add to card icons */}
                  <div className="animate-bounce">
                    <BsCart4 size={26} />
                  </div>
                  <div className="font-semibold text-sm">
                    {cartItem[0] ? (
                      <div>
                        <p>{totalQty} Items</p>
                        <p>{DisplayPriceInRupees(totalPrice)}</p>
                      </div>
                    ) : (
                      <p>My Cart</p>
                    )}
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-2 lg:hidden">
        <Search />
      </div>

      {openCartSection && (
        <DisplayCartItem close={() => setOpenCartSection(false)} />
      )}
    </header>
  );
};

export default Header;
