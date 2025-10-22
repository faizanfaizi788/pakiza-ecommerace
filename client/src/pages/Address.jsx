import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import AddAddress from '../components/AddAddress';
import { MdDelete } from 'react-icons/md';
import { MdEdit } from 'react-icons/md';
import EditAddressDetails from '../components/EditAddressDetails';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { useGlobalContext } from '../provider/GlobalProvider';

const Address = () => {
  const addressList = useSelector((state) => state.addresses.addressList);
  const [openAddress, setOpenAddress] = useState(false);
  const [OpenEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const { fetchAddress } = useGlobalContext();

  const handleDisableAddress = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.disableAddress,
        data: {
          _id: id,
        },
      });
      if (response.data.success) {
        toast.success('Address Remove');
        if (fetchAddress) {
          fetchAddress();
        }
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 shadow-lg px-6 py-4 flex justify-between gap-4 items-center">
        <h2 className="text-2xl font-bold text-white">My Addresses</h2>
        <button
          onClick={() => setOpenAddress(true)}
          className="bg-white text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
        >
          + Add Address
        </button>
      </div>
      <div className="p-6 grid gap-6 max-w-4xl mx-auto">
        {addressList.map((address, index) => {
          return (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 ${
                !address.status && 'hidden'
              }`}
            >
              <div className="p-6 flex gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm font-medium text-purple-600 uppercase tracking-wider">
                      Delivery Address
                    </span>
                  </div>
                  <p className="text-gray-800 font-medium">
                    {address.address_line}
                  </p>
                  <p className="text-gray-600">
                    {address.city}, {address.state}
                  </p>
                  <p className="text-gray-600">
                    {address.country} - {address.pincode}
                  </p>
                  <p className="text-gray-700 font-medium">
                    📱 {address.mobile}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setOpenEdit(true);
                      setEditData(address);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors duration-200 shadow-md"
                  >
                    <MdEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDisableAddress(address._id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors duration-200 shadow-md"
                  >
                    <MdDelete size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        <div
          onClick={() => setOpenAddress(true)}
          className="bg-white border-2 border-dashed border-purple-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all duration-200"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
            <span className="text-purple-600 text-2xl font-bold">+</span>
          </div>
          <p className="text-purple-600 font-medium">Add New Address</p>
          <p className="text-gray-500 text-sm mt-1">
            Click to add a delivery address
          </p>
        </div>
      </div>

      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}

      {OpenEdit && (
        <EditAddressDetails data={editData} close={() => setOpenEdit(false)} />
      )}
    </div>
  );
};

export default Address;
