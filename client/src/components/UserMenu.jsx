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
    <div>
      <div className="font-semibold text-purple-700">My Account</div>
      <div className="text-sm flex items-center gap-2">
        <span className="max-w-52 text-ellipsis line-clamp-1">
          {user.name || user.mobile}{' '}
          <span className="text-medium bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold">
            {user.role === 'ADMIN' ? '(Admin)' : ''}
          </span>
        </span>
        <Link
          onClick={handleClose}
          to={'/dashboard/profile'}
          className="hover:text-purple-600 transition-colors duration-300"
        >
          <HiOutlineExternalLink size={15} />
        </Link>
      </div>

      <Divider />

      <div className="text-sm grid gap-1">
        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={'/dashboard/category'}
            className="px-2 hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 py-1 rounded-lg transition-all duration-300"
          >
            Category
          </Link>
        )}

        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={'/dashboard/subcategory'}
            className="px-2 hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 py-1 rounded-lg transition-all duration-300"
          >
            Sub Category
          </Link>
        )}

        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={'/dashboard/upload-product'}
            className="px-2 hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 py-1 rounded-lg transition-all duration-300"
          >
            Upload Product
          </Link>
        )}

        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={'/dashboard/product'}
            className="px-2 hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 py-1 rounded-lg transition-all duration-300"
          >
            Product
          </Link>
        )}

        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={'/dashboard/admin-orders'}
            className="px-2 hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 py-1 rounded-lg transition-all duration-300"
          >
            Manage Orders
          </Link>
        )}

        {!isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={'/dashboard/myorders'}
            className="px-2 hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 py-1 rounded-lg transition-all duration-300"
          >
            My Orders
          </Link>
        )}

        {!isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={'/dashboard/address'}
            className="px-2 hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 py-1 rounded-lg transition-all duration-300"
          >
            Save Address
          </Link>
        )}

        <button
          onClick={handleLogout}
          className="text-left px-2 hover:bg-gradient-to-r hover:from-red-100 hover:to-pink-100 py-1 rounded-lg transition-all duration-300 text-red-600"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
