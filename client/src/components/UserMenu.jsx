import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Divider from './Divider';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { logout } from '../store/userSlice';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { HiOutlineExternalLink } from 'react-icons/hi';
import isAdmin from '../utils/isAdmin';

const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.logout,
      });
      console.log('logout', response);
      if (response.data.success) {
        if (close) {
          close();
        }
        dispatch(logout());
        localStorage.clear();
        toast.success(response.data.message);
        navigate('/');
      }
    } catch (error) {
      console.log(error);
      AxiosToastError(error);
    }
  };

  const handleClose = () => {
    if (close) {
      close();
    }
  };
  return (
    <div className="space-y-1">
      {/* Navigation Links */}
      <div className="space-y-1">
        {isAdmin(user.role) && (
          <>
            <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 px-2">
              Admin Panel
            </h4>
            <Link
              onClick={handleClose}
              to={'/dashboard/category'}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-theme-50 hover:text-theme-700 rounded-lg transition-all duration-200"
            >
              Category Management
            </Link>
            <Link
              onClick={handleClose}
              to={'/dashboard/subcategory'}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-theme-50 hover:text-theme-700 rounded-lg transition-all duration-200"
            >
              Sub Category
            </Link>
            <Link
              onClick={handleClose}
              to={'/dashboard/upload-product'}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-theme-50 hover:text-theme-700 rounded-lg transition-all duration-200"
            >
              Upload Product
            </Link>
            <Link
              onClick={handleClose}
              to={'/dashboard/product'}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-theme-50 hover:text-theme-700 rounded-lg transition-all duration-200"
            >
              Product Management
            </Link>
            <Link
              onClick={handleClose}
              to={'/dashboard/admin-orders'}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-theme-50 hover:text-theme-700 rounded-lg transition-all duration-200"
            >
              Manage Orders
            </Link>
            <div className="border-t border-gray-100 my-2"></div>
          </>
        )}

        {!isAdmin(user.role) && (
          <>
            <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 px-2">
              My Account
            </h4>
            <Link
              onClick={handleClose}
              to={'/dashboard/profile'}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-theme-50 hover:text-theme-700 rounded-lg transition-all duration-200"
            >
              Profile Settings
            </Link>
            <Link
              onClick={handleClose}
              to={'/dashboard/myorders'}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-theme-50 hover:text-theme-700 rounded-lg transition-all duration-200"
            >
              My Orders
            </Link>
            <Link
              onClick={handleClose}
              to={'/dashboard/address'}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-theme-50 hover:text-theme-700 rounded-lg transition-all duration-200"
            >
              Saved Addresses
            </Link>
            <div className="border-t border-gray-100 my-2"></div>
          </>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
