import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import uploadImage from '../utils/UploadImage';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';

const UploadCategoryModel = ({ close, fetchData }) => {
  const [data, setData] = useState({
    name: '',
    image: '',
  });
  const [loading, setLoading] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.addCategory,
        data: data,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        close();
        fetchData();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadCategoryImage = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const response = await uploadImage(file);
    const { data: ImageResponse } = response;

    setData((preve) => {
      return {
        ...preve,
        image: ImageResponse.data.url,
      };
    });
  };
  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 p-4 bg-neutral-800 bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-white to-purple-50 max-w-4xl w-full p-6 rounded-xl shadow-xl border border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent">
            Add New Category
          </h1>
          <button
            onClick={close}
            className="w-fit block ml-auto p-2 hover:bg-red-100 rounded-lg transition-colors duration-200"
          >
            <IoClose size={25} className="text-gray-600 hover:text-red-600" />
          </button>
        </div>
        <form className="my-3 grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <label
              htmlFor="categoryName"
              className="font-semibold text-gray-700"
            >
              Category Name
            </label>
            <input
              type="text"
              id="categoryName"
              placeholder="Enter category name"
              value={data.name}
              name="name"
              onChange={handleOnChange}
              className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 border border-purple-200 focus:border-purple-400 outline-none rounded-lg shadow-sm transition-all duration-300"
            />
          </div>
          <div className="grid gap-2">
            <p className="font-semibold text-gray-700">Category Image</p>
            <div className="flex gap-4 flex-col lg:flex-row items-center">
              <div className="border-2 border-dashed border-purple-300 bg-gradient-to-br from-purple-50 to-blue-50 h-36 w-full lg:w-36 flex items-center justify-center rounded-lg">
                {data.image ? (
                  <img
                    alt="category"
                    src={data.image}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <p className="text-sm text-purple-600">No Image</p>
                )}
              </div>
              <label htmlFor="uploadCategoryImage">
                <div
                  className={`
                            ${
                              !data.name
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white cursor-pointer'
                            }  
                                px-4 py-3 rounded-lg border shadow-md hover:shadow-lg font-medium transition-all duration-300
                            `}
                >
                  {loading ? 'Uploading...' : 'Upload Image'}
                </div>

                <input
                  disabled={!data.name}
                  onChange={handleUploadCategoryImage}
                  type="file"
                  id="uploadCategoryImage"
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={!(data.name && data.image)}
            className={`
                    ${
                      data.name && data.image
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }
                    py-3 px-6 rounded-lg font-semibold transition-all duration-300
                    `}
          >
            {loading ? 'Adding...' : 'Add Category'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default UploadCategoryModel;
