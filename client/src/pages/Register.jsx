import React, { useState } from 'react';
import { FaRegEyeSlash } from 'react-icons/fa6';
import { FaRegEye } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (data.password !== data.confirmPassword) {
      toast.error('password and confirm password must be same');
      return;
    }

    try {
      const response = await Axios({
        ...SummaryApi.register,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
        navigate('/login');
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
            Welcome to Pakiza
          </h2>
          <p className="text-gray-600 mt-3 text-sm">
            Create your account to get started
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium text-sm"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              autoFocus
              className="w-full bg-gradient-to-r from-purple-50 to-blue-50 p-4 border border-purple-200 rounded-xl outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200"
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>
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
          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 font-medium text-sm"
            >
              Confirm Password
            </label>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl flex items-center p-4 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 transition-all duration-200">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                className="w-full outline-none bg-transparent"
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />
              <div
                onClick={() => setShowConfirmPassword((preve) => !preve)}
                className="cursor-pointer text-purple-600 hover:text-purple-800 ml-2"
              >
                {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
          </div>

          <button
            disabled={!valideValue}
            className={`w-full ${
              valideValue
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-400 cursor-not-allowed'
            } text-white py-4 rounded-xl font-semibold transition-all duration-200 mt-2`}
          >
            Create Account
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link
              to={'/login'}
              className="font-semibold text-purple-600 hover:text-purple-800 transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;
