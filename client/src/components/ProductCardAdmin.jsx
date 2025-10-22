import React, { useState } from 'react';
import EditProductAdmin from './EditProductAdmin';
import CofirmBox from './CofirmBox';
import { IoClose } from 'react-icons/io5';
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';

const ProductCardAdmin = ({ data, fetchProductData }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleDeleteCancel = () => {
    setOpenDelete(false);
  };

  const handleDelete = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteProduct,
        data: {
          _id: data._id,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        if (fetchProductData) {
          fetchProductData();
        }
        setOpenDelete(false);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  return (
    <div className="w-full max-w-sm bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-purple-300 group">
      {/* Image Container */}
      <div className="relative h-40 bg-gray-50 overflow-hidden">
        <img
          src={data?.image[0]}
          alt={data?.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
        {data?.discount > 0 && (
          <div className="absolute top-2 right-2">
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
              -{data?.discount}%
            </span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-4 space-y-3">
        {/* Product Name */}
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight min-h-[2.5rem]">
          {data?.name}
        </h3>

        {/* Product Details */}
        <div className="space-y-1">
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            {data?.unit}
          </p>
          <p className="text-lg font-bold text-purple-600">₨{data?.price}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => setEditOpen(true)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors duration-200"
          >
            Edit
          </button>
          <button
            onClick={() => setOpenDelete(true)}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>

      {editOpen && (
        <EditProductAdmin
          fetchProductData={fetchProductData}
          data={data}
          close={() => setEditOpen(false)}
        />
      )}

      {openDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Product
                </h3>
                <button
                  onClick={() => setOpenDelete(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <IoClose size={20} />
                </button>
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{data?.name}"? This action
                cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleDeleteCancel}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCardAdmin;
