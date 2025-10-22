import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../provider/GlobalProvider';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import AddAddress from '../components/AddAddress';
import { useSelector } from 'react-redux';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const CheckoutPage = () => {
  const {
    notDiscountTotalPrice,
    totalPrice,
    totalQty,
    fetchCartItem,
    fetchOrder,
  } = useGlobalContext();
  const [openAddress, setOpenAddress] = useState(false);
  const addressList = useSelector((state) => state.addresses.addressList);
  const [selectAddress, setSelectAddress] = useState(0);
  const cartItemsList = useSelector((state) => state.cartItem.cart);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  // Check if user is admin and redirect
  useEffect(() => {
    if (user?.role === 'ADMIN') {
      toast.error('Admins cannot place orders');
      navigate('/');
    }
  }, [user, navigate]);

  const handleCashOnDelivery = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        if (fetchCartItem) {
          fetchCartItem();
        }
        if (fetchOrder) {
          fetchOrder();
        }
        navigate('/success', {
          state: {
            text: 'Order',
          },
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleOnlinePayment = async () => {
    try {
      toast.loading('Loading...');
      const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
      const stripePromise = await loadStripe(stripePublicKey);

      const response = await Axios({
        ...SummaryApi.payment_url,
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        },
      });

      const { data: responseData } = response;

      stripePromise.redirectToCheckout({ sessionId: responseData.id });

      if (fetchCartItem) {
        fetchCartItem();
      }
      if (fetchOrder) {
        fetchOrder();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  return (
    <section className="bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
      <div className="container mx-auto p-4 flex flex-col lg:flex-row w-full gap-6 justify-between">
        <div className="w-full">
          {/***address***/}
          <h3 className="text-2xl font-bold text-purple-800 mb-4">
            Choose your address
          </h3>
          <div className="bg-gradient-to-r from-white to-purple-50 p-4 rounded-xl shadow-lg border border-purple-200 grid gap-4">
            {addressList.map((address, index) => {
              return (
                <label
                  key={address._id}
                  htmlFor={'address' + index}
                  className={!address.status && 'hidden'}
                >
                  <div className="border border-purple-200 rounded-xl p-4 flex gap-3 hover:bg-purple-50 transition-all cursor-pointer">
                    <div>
                      <input
                        id={'address' + index}
                        type="radio"
                        value={index}
                        onChange={(e) => setSelectAddress(e.target.value)}
                        name="address"
                        className="accent-purple-600"
                      />
                    </div>
                    <div>
                      <p>{address.address_line}</p>
                      <p>{address.city}</p>
                      <p>{address.state}</p>
                      <p>
                        {address.country} - {address.pincode}
                      </p>
                      <p>{address.mobile}</p>
                    </div>
                  </div>
                </label>
              );
            })}
            <div
              onClick={() => setOpenAddress(true)}
              className="h-16 bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-300 rounded-xl flex justify-center items-center cursor-pointer hover:from-purple-200 hover:to-blue-200 transition-all"
            >
              <p className="text-purple-700 font-semibold">Add Address</p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md bg-gradient-to-r from-white to-purple-50 py-6 px-4 rounded-xl shadow-lg border border-purple-200">
          {/**summary**/}
          <h3 className="text-xl font-bold text-purple-800 mb-4">
            Order Summary
          </h3>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl border border-purple-200">
            <h3 className="font-semibold text-purple-700 mb-3">Bill details</h3>
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
          <div className="w-full flex flex-col gap-4 mt-6">
            <button
              className="py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl text-white font-semibold transition-all shadow-lg"
              onClick={handleOnlinePayment}
            >
              Online Payment
            </button>

            <button
              className="py-3 px-4 border-2 border-purple-600 font-semibold text-purple-600 hover:bg-purple-600 hover:text-white rounded-xl transition-all"
              onClick={handleCashOnDelivery}
            >
              Cash on Delivery
            </button>
          </div>
        </div>
      </div>

      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
    </section>
  );
};

export default CheckoutPage;
