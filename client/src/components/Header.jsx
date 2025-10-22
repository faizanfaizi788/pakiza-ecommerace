import React, { useEffect, useState } from 'react';
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
  // const [totalPrice,setTotalPrice] = useState(0)
  // const [totalQty,setTotalQty] = useState(0)
  const { totalPrice, totalQty } = useGlobalContext();
  const [openCartSection, setOpenCartSection] = useState(false);

  const redirectToLoginPage = () => {
    navigate('/login');
  };

  const handleCloseUserMenu = () => {
    setOpenUserMenu(false);
  };

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
    <header className="h-24 lg:h-20 lg:shadow-lg sticky top-0 z-40 flex flex-col justify-center gap-1 bg-gradient-to-r from-white via-blue-50 to-purple-50 backdrop-blur-sm border-b border-purple-100">
      {!(isSearchPage && isMobile) && (
        <div className="container mx-auto flex items-center px-2 justify-between">
          {/**logo */}
          <div className="h-full">
            <Link to={'/'} className="h-full flex justify-center items-center">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <MdStorefront className="text-3xl lg:text-4xl text-gradient bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full animate-pulse"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent">
                    Pakiza
                  </span>
                  <span className="text-xs text-gray-500 -mt-1 hidden lg:block">
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
            <div className="hidden lg:flex  items-center gap-10">
              {user?._id ? (
                <div className="relative">
                  <div
                    onClick={() => setOpenUserMenu((preve) => !preve)}
                    className="flex select-none items-center gap-1 cursor-pointer"
                  >
                    <p>Account</p>
                    {openUserMenu ? (
                      <GoTriangleUp size={25} />
                    ) : (
                      <GoTriangleDown size={25} />
                    )}
                  </div>
                  {openUserMenu && (
                    <div className="absolute right-0 top-12">
                      <div className="bg-white rounded p-4 min-w-52 lg:shadow-lg">
                        <UserMenu close={handleCloseUserMenu} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={redirectToLoginPage} className="text-lg px-2">
                  Login
                </button>
              )}

              {/* Hide cart button for admin users */}
              {user?.role !== 'ADMIN' && (
                <button
                  onClick={() => setOpenCartSection(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-3 py-2 rounded-lg text-white shadow-lg transition-all duration-300 transform hover:scale-105"
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
