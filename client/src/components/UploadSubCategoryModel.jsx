import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import uploadImage from '../utils/UploadImage';
import { useSelector } from 'react-redux';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { useEffect } from 'react';

const UploadSubCategoryModel = ({ close, fetchData }) => {
  const [subCategoryData, setSubCategoryData] = useState({
    name: '',
    image: '',
    category: [],
  });
  const allCategory = useSelector((state) => state.product.allCategory);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSubCategoryData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleUploadSubCategoryImage = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const response = await uploadImage(file);
    const { data: ImageResponse } = response;

    setSubCategoryData((preve) => {
      return {
        ...preve,
        image: ImageResponse.data.url,
      };
    });
  };

  const handleRemoveCategorySelected = (categoryId) => {
    const index = subCategoryData.category.findIndex(
      (el) => el._id === categoryId
    );
    subCategoryData.category.splice(index, 1);
    setSubCategoryData((preve) => {
      return {
        ...preve,
      };
    });
  };

  const handleSubmitSubCategory = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...SummaryApi.createSubCategory,
        data: subCategoryData,
      });

      const { data: responseData } = response;

      console.log('responseData', responseData);
      if (responseData.success) {
        toast.success(responseData.message);
        if (close) {
          close();
        }
        if (fetchData) {
          fetchData();
        }
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="fixed top-0 right-0 bottom-0 left-0 bg-neutral-800 bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-gradient-to-br from-white to-purple-50 p-6 rounded-xl shadow-xl border border-purple-200">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent">
            Add Sub Category
          </h1>
          <button
            onClick={close}
            className="p-2 hover:bg-red-100 rounded-lg transition-colors duration-200"
          >
            <IoClose size={25} className="text-gray-600 hover:text-red-600" />
          </button>
        </div>
        <form className="my-3 grid gap-4" onSubmit={handleSubmitSubCategory}>
          <div className="grid gap-2">
            <label htmlFor="name" className="font-semibold text-gray-700">
              Sub Category Name
            </label>
            <input
              id="name"
              name="name"
              value={subCategoryData.name}
              onChange={handleChange}
              placeholder="Enter sub category name"
              className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 focus:border-purple-400 outline-none rounded-lg shadow-sm transition-all duration-300"
            />
          </div>
          <div className="grid gap-2">
            <p className="font-semibold text-gray-700">Sub Category Image</p>
            <div className="flex flex-col lg:flex-row items-center gap-4">
              <div className="border-2 border-dashed border-purple-300 h-36 w-full lg:w-36 bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center rounded-lg">
                {!subCategoryData.image ? (
                  <p className="text-sm text-purple-600">No Image</p>
                ) : (
                  <img
                    alt="subCategory"
                    src={subCategoryData.image}
                    className="w-full h-full object-cover rounded-lg"
                  />
                )}
              </div>
              <label htmlFor="uploadSubCategoryImage">
                <div className="px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg cursor-pointer font-medium shadow-md hover:shadow-lg transition-all duration-300">
                  Upload Image
                </div>
                <input
                  type="file"
                  id="uploadSubCategoryImage"
                  className="hidden"
                  onChange={handleUploadSubCategoryImage}
                />
              </label>
            </div>
          </div>
          <div className="grid gap-2">
            <label className="font-semibold text-gray-700">
              Select Categories
            </label>
            <div className="border border-purple-200 focus-within:border-purple-400 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 shadow-sm">
              {/*display value**/}
              <div className="flex flex-wrap gap-2 p-3">
                {subCategoryData.category.map((cat, index) => {
                  return (
                    <div
                      key={cat._id + 'selectedValue'}
                      className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 px-3 py-2 rounded-lg flex items-center gap-2 border border-purple-200 shadow-sm"
                    >
                      <span className="font-medium">{cat.name}</span>
                      <div
                        className="cursor-pointer hover:text-red-500 transition-colors duration-200"
                        onClick={() => handleRemoveCategorySelected(cat._id)}
                      >
                        <IoClose size={18} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/*select category**/}
              <select
                className="w-full p-3 bg-transparent outline-none border-t border-purple-200 text-gray-700 font-medium"
                onChange={(e) => {
                  const value = e.target.value;
                  const categoryDetails = allCategory.find(
                    (el) => el._id == value
                  );

                  setSubCategoryData((preve) => {
                    return {
                      ...preve,
                      category: [...preve.category, categoryDetails],
                    };
                  });
                }}
              >
                <option value={''}>Select Category</option>
                {allCategory.map((category, index) => {
                  return (
                    <option
                      value={category?._id}
                      key={category._id + 'subcategory'}
                    >
                      {category?.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={
              !(
                subCategoryData?.name &&
                subCategoryData?.image &&
                subCategoryData?.category[0]
              )
            }
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300
                            ${
                              subCategoryData?.name &&
                              subCategoryData?.image &&
                              subCategoryData?.category[0]
                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }    
                        `}
          >
            Add Sub Category
          </button>
        </form>
      </div>
    </section>
  );
};

export default UploadSubCategoryModel;
