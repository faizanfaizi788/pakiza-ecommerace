import React, { useState } from 'react';
import { FaRegEyeSlash } from 'react-icons/fa6';
import { FaRegEye } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [data, setData] = useState({
    email: '',
  });
  const navigate = useNavigate();

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
        ...SummaryApi.forgot_password,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/verification-otp', {
          state: data,
        });
        setData({
          email: '',
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="w-full container mx-auto px-4 py-8">
      <div className="bg-white my-8 w-full max-w-lg mx-auto rounded-xl shadow-xl border border-theme-200 p-8">
        <div className="text-center mb-6">
          <h1 className="font-bold text-2xl text-theme-800 mb-2">
            Forgot Password?
          </h1>
          <p className="text-theme-600 text-sm">
            Enter your email address and we'll send you an OTP to reset your
            password.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-theme-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full bg-theme-50 p-3 border border-theme-200 rounded-lg outline-none focus:border-theme-500 focus:ring-2 focus:ring-theme-100 transition-all duration-200"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
            />
          </div>

          <button
            disabled={!valideValue}
            className={`w-full py-3 rounded-lg font-semibold tracking-wide transition-all duration-300 ${
              valideValue
                ? 'bg-theme-gradient hover:shadow-lg text-white transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Send OTP
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-theme-600 text-sm">
            Remember your password?
            <Link
              to={'/login'}
              className="font-semibold text-theme-600 hover:text-theme-700 ml-1 underline hover:no-underline transition-all duration-200"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
