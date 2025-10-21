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
    <section className="w-full container mx-auto px-2 min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
      <div className="bg-gradient-to-r from-white to-purple-50 my-4 w-full max-w-lg mx-auto rounded-xl shadow-lg p-7 border border-purple-200">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-gray-600 mt-2">Sign in to your Pakiza account</p>
        </div>

        <form className="grid gap-6 py-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <label htmlFor="email" className="text-gray-700 font-medium">
              Email :
            </label>
            <input
              type="email"
              id="email"
              className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 border border-purple-200 rounded-xl outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="password" className="text-gray-700 font-medium">
              Password :
            </label>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 border border-purple-200 rounded-xl flex items-center focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
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
                className="cursor-pointer text-purple-600 hover:text-purple-800"
              >
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
            <Link
              to={'/forgot-password'}
              className="block ml-auto hover:text-purple-600 text-purple-500 transition-colors"
            >
              Forgot password ?
            </Link>
          </div>

          <button
            disabled={!valideValue}
            className={` ${
              valideValue
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                : 'bg-gray-400'
            } text-white py-3 rounded-xl font-semibold my-3 tracking-wide transition-all shadow-lg`}
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-600">
          Don't have account?{' '}
          <Link
            to={'/register'}
            className="font-semibold text-purple-600 hover:text-purple-800 transition-colors"
          >
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
