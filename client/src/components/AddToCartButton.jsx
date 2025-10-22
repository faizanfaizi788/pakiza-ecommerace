import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../provider/GlobalProvider';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import Loading from './Loading';
import { useSelector } from 'react-redux';
import { FaMinus, FaPlus } from 'react-icons/fa6';

const AddToCartButton = ({ data }) => {
  const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const cartItem = useSelector((state) => state.cartItem.cart);
  const user = useSelector((state) => state.user);
  const [isAvailableCart, setIsAvailableCart] = useState(false);
  const [qty, setQty] = useState(0);
  const [cartItemDetails, setCartItemsDetails] = useState();

  // Check if user is admin - admins cannot place orders
  const isAdmin = user?.role === 'ADMIN';

  const handleADDTocart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is logged in
    if (!user?._id) {
      toast.error('Please login to add items to cart');
      return;
    }

    // Prevent admins from adding items to cart
    if (isAdmin) {
      toast.error('Admins cannot place orders');
      return;
    }

    try {
      setLoading(true);

      const response = await Axios({
        ...SummaryApi.addTocart,
        data: {
          productId: data?._id,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        if (fetchCartItem) {
          fetchCartItem();
        }
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  //checking this item in cart or not
  useEffect(() => {
    const checkingitem = cartItem.some(
      (item) => item.productId._id === data._id
    );
    setIsAvailableCart(checkingitem);

    const product = cartItem.find((item) => item.productId._id === data._id);
    setQty(product?.quantity);
    setCartItemsDetails(product);
  }, [data, cartItem]);

  const increaseQty = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is logged in
    if (!user?._id) {
      toast.error('Please login to modify cart items');
      return;
    }

    // Prevent admins from updating cart
    if (isAdmin) {
      toast.error('Admins cannot place orders');
      return;
    }

    const response = await updateCartItem(cartItemDetails?._id, qty + 1);

    if (response.success) {
      toast.success('Item added');
    }
  };

  const decreaseQty = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is logged in
    if (!user?._id) {
      toast.error('Please login to modify cart items');
      return;
    }

    // Prevent admins from updating cart
    if (isAdmin) {
      toast.error('Admins cannot place orders');
      return;
    }

    if (qty === 1) {
      deleteCartItem(cartItemDetails?._id);
    } else {
      const response = await updateCartItem(cartItemDetails?._id, qty - 1);

      if (response.success) {
        toast.success('Item remove');
      }
    }
  };
  return (
    <div className="w-full max-w-[150px]">
      {/* Hide cart functionality for admins */}
      {isAdmin ? (
        <div className="bg-gray-300 text-gray-500 px-2 lg:px-4 py-1 rounded-lg font-medium text-center cursor-not-allowed">
          Admin Account
        </div>
      ) : isAvailableCart ? (
        <div className="flex w-full h-full">
          <button
            onClick={decreaseQty}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white flex-1 w-full p-1 rounded-l-lg flex items-center justify-center transition-all duration-300"
          >
            <FaMinus />
          </button>

          <p className="flex-1 w-full font-semibold px-1 flex items-center justify-center bg-white border-t border-b border-purple-200">
            {qty}
          </p>

          <button
            onClick={increaseQty}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white flex-1 w-full p-1 rounded-r-lg flex items-center justify-center transition-all duration-300"
          >
            <FaPlus />
          </button>
        </div>
      ) : (
        <button
          onClick={handleADDTocart}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-2 lg:px-4 py-1 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
        >
          {loading ? <Loading /> : 'Add'}
        </button>
      )}
    </div>
  );
};

export default AddToCartButton;
