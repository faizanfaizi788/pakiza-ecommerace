import React from 'react';
import { IoClose } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../provider/GlobalProvider';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { FaCaretRight } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import AddToCartButton from './AddToCartButton';
import { pricewithDiscount } from '../utils/PriceWithDiscount';
import imageEmpty from '../assets/empty_cart.webp';
import toast from 'react-hot-toast';

const DisplayCartItem = ({ close }) => {
  const { notDiscountTotalPrice, totalPrice, totalQty } = useGlobalContext();
  const cartItem = useSelector((state) => state.cartItem.cart);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const redirectToCheckoutPage = () => {
    if (user?.role === 'ADMIN') {
      toast.error('Admins cannot place orders');
      return;
    }

    if (user?._id) {
      navigate('/checkout');
      if (close) {
        close();
      }
      return;
    }
    toast('Please Login');
  };
  return (
    <section className="fixed top-0 bottom-0 right-0 left-0 z-50 bg-white/30 backdrop-blur-md">
      <div className="bg-gradient-to-br from-white to-purple-50 w-full max-w-sm min-h-screen max-h-screen ml-auto shadow-2xl border-l border-purple-200">
        <div className="flex items-center p-4 shadow-md gap-3 justify-between bg-gradient-to-r from-purple-600 to-blue-600">
          <h2 className="font-semibold text-white text-lg">Shopping Cart</h2>
          <Link to={'/'} className="lg:hidden">
            <IoClose
              size={25}
              className="text-white hover:text-purple-200 transition-colors"
            />
          </Link>
          <button onClick={close} className="hidden lg:block">
            <IoClose
              size={25}
              className="text-white hover:text-purple-200 transition-colors"
            />
          </button>
        </div>

        <div className="min-h-[75vh] lg:min-h-[80vh] h-full max-h-[calc(100vh-150px)] bg-gradient-to-br from-purple-50 to-blue-50 p-3 flex flex-col gap-4">
          {/***display items */}
          {cartItem[0] ? (
            <>
              <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-xl border border-purple-200 shadow-sm">
                <p className="font-medium">Your total savings</p>
                <p className="font-semibold">
                  {DisplayPriceInRupees(notDiscountTotalPrice - totalPrice)}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 grid gap-5 overflow-auto">
                {cartItem[0] &&
                  cartItem.map((item, index) => {
                    return (
                      <div
                        key={item?._id + 'cartItemDisplay'}
                        className="flex  w-full gap-4"
                      >
                        <div className="w-16 h-16 min-h-16 min-w-16 bg-red-500 border rounded">
                          <img
                            src={item?.productId?.image[0]}
                            className="object-scale-down"
                          />
                        </div>
                        <div className="w-full max-w-sm text-xs">
                          <p className="text-xs text-ellipsis line-clamp-2">
                            {item?.productId?.name}
                          </p>
                          <p className="text-neutral-400">
                            {item?.productId?.unit}
                          </p>
                          <p className="font-semibold">
                            {DisplayPriceInRupees(
                              pricewithDiscount(
                                item?.productId?.price,
                                item?.productId?.discount
                              )
                            )}
                          </p>
                        </div>
                        <div>
                          <AddToCartButton data={item?.productId} />
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="bg-gradient-to-r from-white to-purple-50 p-4 rounded-xl shadow-lg border border-purple-200">
                <h3 className="font-semibold text-purple-700 mb-3">
                  Bill details
                </h3>
                <div className="flex gap-4 justify-between mb-2">
                  <p className="text-gray-700">Items total</p>
                  <p className="flex items-center gap-2">
                    <span className="line-through text-gray-400">
                      {DisplayPriceInRupees(notDiscountTotalPrice)}
                    </span>
                    <span className="text-purple-700 font-semibold">
                      {DisplayPriceInRupees(totalPrice)}
                    </span>
                  </p>
                </div>
                <div className="flex gap-4 justify-between mb-2">
                  <p className="text-gray-700">Quantity total</p>
                  <p className="flex items-center gap-2 text-purple-700 font-medium">
                    {totalQty} item
                  </p>
                </div>
                <div className="flex gap-4 justify-between mb-2">
                  <p className="text-gray-700">Delivery Charge</p>
                  <p className="flex items-center gap-2 text-green-600 font-medium">
                    Free
                  </p>
                </div>
                <div className="border-t border-purple-200 pt-2 mt-3">
                  <div className="font-semibold flex items-center justify-between gap-4 text-lg">
                    <p className="text-purple-800">Grand total</p>
                    <p className="text-purple-800">
                      {DisplayPriceInRupees(totalPrice)}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-gradient-to-r from-white to-purple-50 flex flex-col justify-center items-center rounded-xl shadow-lg border border-purple-200 p-6">
              <img
                src={imageEmpty}
                className="w-full h-full object-scale-down max-w-48"
              />
              <Link
                onClick={close}
                to={'/'}
                className="block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-3 text-white rounded-xl font-semibold transition-all shadow-lg mt-4"
              >
                Shop Now
              </Link>
            </div>
          )}
        </div>

        {cartItem[0] && (
          <div className="p-3">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 font-bold text-base py-4 rounded-xl flex items-center gap-4 justify-between shadow-lg hover:shadow-xl transition-all">
              <div className="text-lg">{DisplayPriceInRupees(totalPrice)}</div>
              <button
                onClick={redirectToCheckoutPage}
                className="flex items-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
              >
                Proceed
                <span>
                  <FaCaretRight />
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DisplayCartItem;
