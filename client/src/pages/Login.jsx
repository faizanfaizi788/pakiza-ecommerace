import React, { useState } from 'react';
import { FaRegEyeSlash } from 'react-icons/fa6';
import { FaRegEye } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';

const Login = () => {
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const valideValue = Object.values(data).every((el) => el);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...SummaryApi.login,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem('accesstoken', response.data.data.accesstoken);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);

        const userDetails = await fetchUserDetails();
        dispatch(setUserDetails(userDetails.data));

        setData({
          email: '',
          password: '',
        });
        navigate('/');
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  return (
    <section className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center px-4 py-8">
      <div className="bg-gradient-to-r from-white to-purple-50 w-full max-w-md rounded-2xl shadow-2xl p-8 border border-purple-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-gray-600 mt-3 text-sm">
            Sign in to your Pakiza account
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium text-sm"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full bg-gradient-to-r from-purple-50 to-blue-50 p-4 border border-purple-200 rounded-xl outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter your email address"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium text-sm"
            >
              Password
            </label>
            <div className="relative">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl flex items-center p-4 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 transition-all duration-200">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="w-full outline-none bg-transparent"
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
                <div
                  onClick={() => setShowPassword((preve) => !preve)}
                  className="cursor-pointer text-purple-600 hover:text-purple-800 ml-2"
                >
                  {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </div>
              </div>
            </div>
            <div className="text-right">
              <Link
                to={'/forgot-password'}
                className="text-sm text-purple-500 hover:text-purple-600 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            disabled={!valideValue}
            className={`w-full ${
              valideValue
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-400 cursor-not-allowed'
            } text-white py-4 rounded-xl font-semibold transition-all duration-200`}
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link
              to={'/register'}
              className="font-semibold text-purple-600 hover:text-purple-800 transition-colors"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
