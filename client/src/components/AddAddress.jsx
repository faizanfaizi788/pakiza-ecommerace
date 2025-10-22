import React from 'react';
import { useForm } from 'react-hook-form';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { IoClose } from 'react-icons/io5';
import { useGlobalContext } from '../provider/GlobalProvider';

const AddAddress = ({ close }) => {
  const { register, handleSubmit, reset } = useForm();
  const { fetchAddress } = useGlobalContext();

  const onSubmit = async (data) => {
    console.log('data', data);

    try {
      const response = await Axios({
        ...SummaryApi.createAddress,
        data: {
          address_line: data.addressline,
          city: data.city,
          state: data.state,
          country: data.country,
          pincode: data.pincode,
          mobile: data.mobile,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        if (close) {
          close();
          reset();
          fetchAddress();
        }
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  return (
    <section className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Add New Address</h2>
            <button
              onClick={close}
              className="text-white hover:text-red-200 hover:bg-white/20 p-2 rounded-full transition-all duration-200"
            >
              <IoClose size={24} />
            </button>
          </div>
        </div>

        <form className="p-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label
              htmlFor="addressline"
              className="text-sm font-medium text-gray-700"
            >
              Address Line *
            </label>
            <input
              type="text"
              id="addressline"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your complete address"
              {...register('addressline', { required: true })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="city"
                className="text-sm font-medium text-gray-700"
              >
                City *
              </label>
              <input
                type="text"
                id="city"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="City"
                {...register('city', { required: true })}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="state"
                className="text-sm font-medium text-gray-700"
              >
                State *
              </label>
              <input
                type="text"
                id="state"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="State"
                {...register('state', { required: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="pincode"
                className="text-sm font-medium text-gray-700"
              >
                Pincode *
              </label>
              <input
                type="text"
                id="pincode"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="123456"
                {...register('pincode', { required: true })}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="country"
                className="text-sm font-medium text-gray-700"
              >
                Country *
              </label>
              <input
                type="text"
                id="country"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Country"
                {...register('country', { required: true })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="mobile"
              className="text-sm font-medium text-gray-700"
            >
              Mobile Number *
            </label>
            <input
              type="tel"
              id="mobile"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter mobile number"
              {...register('mobile', { required: true })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={close}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium"
            >
              Save Address
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddAddress;
