import React, { useState } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import uploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { MdDelete } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { IoClose } from 'react-icons/io5';
import AddFieldComponent from '../components/AddFieldComponent';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';
import { useEffect } from 'react';

const EditProductAdmin = ({ close, data: propsData, fetchProductData }) => {
  const [data, setData] = useState({
    _id: propsData._id,
    name: propsData.name,
    image: propsData.image,
    category: propsData.category,
    subCategory: propsData.subCategory,
    unit: propsData.unit,
    stock: propsData.stock,
    price: propsData.price,
    discount: propsData.discount,
    description: propsData.description,
    more_details: propsData.more_details || {},
  });
  const [imageLoading, setImageLoading] = useState(false);
  const [ViewImageURL, setViewImageURL] = useState('');
  const allCategory = useSelector((state) => state.product.allCategory);
  const [selectCategory, setSelectCategory] = useState('');
  const [selectSubCategory, setSelectSubCategory] = useState('');
  const allSubCategory = useSelector((state) => state.product.allSubCategory);

  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }
    setImageLoading(true);
    const response = await uploadImage(file);
    const { data: ImageResponse } = response;
    const imageUrl = ImageResponse.data.url;

    setData((preve) => {
      return {
        ...preve,
        image: [...preve.image, imageUrl],
      };
    });
    setImageLoading(false);
  };

  const handleDeleteImage = async (index) => {
    data.image.splice(index, 1);
    setData((preve) => {
      return {
        ...preve,
      };
    });
  };

  const handleRemoveCategory = async (index) => {
    data.category.splice(index, 1);
    setData((preve) => {
      return {
        ...preve,
      };
    });
  };
  const handleRemoveSubCategory = async (index) => {
    data.subCategory.splice(index, 1);
    setData((preve) => {
      return {
        ...preve,
      };
    });
  };

  const handleAddField = () => {
    setData((preve) => {
      return {
        ...preve,
        more_details: {
          ...preve.more_details,
          [fieldName]: '',
        },
      };
    });
    setFieldName('');
    setOpenAddField(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('data', data);

    try {
      const response = await Axios({
        ...SummaryApi.updateProductDetails,
        data: data,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        successAlert(responseData.message);
        if (close) {
          close();
        }
        fetchProductData();
        setData({
          name: '',
          image: [],
          category: [],
          subCategory: [],
          unit: '',
          stock: '',
          price: '',
          discount: '',
          description: '',
          more_details: {},
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="fixed top-0 right-0 left-0 bottom-0 bg-black z-50 bg-opacity-70 p-4">
      <div className="bg-gradient-to-br from-white to-purple-50 w-full p-6 max-w-4xl mx-auto rounded-xl shadow-xl border border-purple-200 overflow-y-auto h-full max-h-[95vh]">
        <section className="">
          <div className="p-4 bg-gradient-to-br from-white to-purple-50 shadow-lg rounded-xl mb-4 border border-purple-100 flex items-center justify-between">
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent">
              Edit Product
            </h2>
            <button
              onClick={close}
              className="p-2 hover:bg-red-100 rounded-lg transition-colors duration-200"
            >
              <IoClose size={24} className="text-gray-600 hover:text-red-600" />
            </button>
          </div>
          <div className="grid p-3">
            <form className="grid gap-6" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <label htmlFor="name" className="font-semibold text-gray-700">
                  Product Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter product name"
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  required
                  className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 outline-none border border-purple-200 focus:border-purple-400 rounded-lg shadow-sm transition-all duration-300"
                />
              </div>
              <div className="grid gap-2">
                <label
                  htmlFor="description"
                  className="font-semibold text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  type="text"
                  placeholder="Enter product description"
                  name="description"
                  value={data.description}
                  onChange={handleChange}
                  required
                  multiple
                  rows={4}
                  className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 outline-none border border-purple-200 focus:border-purple-400 rounded-lg shadow-sm transition-all duration-300 resize-none"
                />
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-3">
                  Product Images
                </p>
                <div>
                  <label
                    htmlFor="productImage"
                    className="bg-gradient-to-br from-purple-50 to-blue-50 h-32 border-2 border-dashed border-purple-300 hover:border-purple-400 rounded-lg flex justify-center items-center cursor-pointer transition-all duration-300 hover:bg-gradient-to-br hover:from-purple-100 hover:to-blue-100"
                  >
                    <div className="text-center flex justify-center items-center flex-col">
                      {imageLoading ? (
                        <Loading />
                      ) : (
                        <>
                          <FaCloudUploadAlt
                            size={40}
                            className="text-purple-600 mb-2"
                          />
                          <p className="text-purple-700 font-medium">
                            Upload Images
                          </p>
                          <p className="text-purple-500 text-sm">
                            Click or drag images here
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      id="productImage"
                      className="hidden"
                      accept="image/*"
                      onChange={handleUploadImage}
                    />
                  </label>
                  {/**display uploded image*/}
                  <div className="flex flex-wrap gap-4 mt-4">
                    {data.image.map((img, index) => {
                      return (
                        <div
                          key={img + index}
                          className="h-24 w-24 min-w-24 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg relative group shadow-md hover:shadow-lg transition-all duration-300"
                        >
                          <img
                            src={img}
                            alt={img}
                            className="w-full h-full object-cover rounded-lg cursor-pointer"
                            onClick={() => setViewImageURL(img)}
                          />
                          <div
                            onClick={() => handleDeleteImage(index)}
                            className="absolute -top-2 -right-2 p-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-full text-white shadow-lg cursor-pointer transition-all duration-300 opacity-0 group-hover:opacity-100"
                          >
                            <MdDelete size={16} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <label className="font-semibold text-gray-700">Category</label>
                <div>
                  <select
                    className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 focus:border-purple-400 w-full p-3 rounded-lg shadow-sm transition-all duration-300 outline-none"
                    value={selectCategory}
                    onChange={(e) => {
                      const value = e.target.value;
                      const category = allCategory.find(
                        (el) => el._id === value
                      );

                      setData((preve) => {
                        return {
                          ...preve,
                          category: [...preve.category, category],
                        };
                      });
                      setSelectCategory('');
                    }}
                  >
                    <option value={''}>Select Category</option>
                    {allCategory.map((c, index) => {
                      return (
                        <option key={c._id} value={c?._id}>
                          {c.name}
                        </option>
                      );
                    })}
                  </select>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {data.category.map((c, index) => {
                      return (
                        <div
                          key={c._id + index + 'productsection'}
                          className="text-sm flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 px-3 py-2 rounded-lg border border-purple-200 shadow-sm"
                        >
                          <p className="text-purple-800 font-medium">
                            {c.name}
                          </p>
                          <div
                            className="hover:text-red-500 cursor-pointer transition-colors duration-200"
                            onClick={() => handleRemoveCategory(index)}
                          >
                            <IoClose size={18} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <label className="font-semibold text-gray-700">
                  Sub Category
                </label>
                <div>
                  <select
                    className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 focus:border-purple-400 w-full p-3 rounded-lg shadow-sm transition-all duration-300 outline-none"
                    value={selectSubCategory}
                    onChange={(e) => {
                      const value = e.target.value;
                      const subCategory = allSubCategory.find(
                        (el) => el._id === value
                      );

                      setData((preve) => {
                        return {
                          ...preve,
                          subCategory: [...preve.subCategory, subCategory],
                        };
                      });
                      setSelectSubCategory('');
                    }}
                  >
                    <option value={''} className="text-neutral-600">
                      Select Sub Category
                    </option>
                    {allSubCategory.map((c, index) => {
                      return (
                        <option key={c._id} value={c?._id}>
                          {c.name}
                        </option>
                      );
                    })}
                  </select>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {data.subCategory.map((c, index) => {
                      return (
                        <div
                          key={c._id + index + 'productsection'}
                          className="text-sm flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 px-3 py-2 rounded-lg border border-purple-200 shadow-sm"
                        >
                          <p className="text-purple-800 font-medium">
                            {c.name}
                          </p>
                          <div
                            className="hover:text-red-500 cursor-pointer transition-colors duration-200"
                            onClick={() => handleRemoveSubCategory(index)}
                          >
                            <IoClose size={18} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <label htmlFor="unit" className="font-semibold text-gray-700">
                    Unit
                  </label>
                  <input
                    id="unit"
                    type="text"
                    placeholder="e.g., kg, piece, liter"
                    name="unit"
                    value={data.unit}
                    onChange={handleChange}
                    required
                    className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 outline-none border border-purple-200 focus:border-purple-400 rounded-lg shadow-sm transition-all duration-300"
                  />
                </div>

                <div className="grid gap-2">
                  <label
                    htmlFor="stock"
                    className="font-semibold text-gray-700"
                  >
                    Stock Quantity
                  </label>
                  <input
                    id="stock"
                    type="number"
                    placeholder="Enter available quantity"
                    name="stock"
                    value={data.stock}
                    onChange={handleChange}
                    required
                    className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 outline-none border border-purple-200 focus:border-purple-400 rounded-lg shadow-sm transition-all duration-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <label
                    htmlFor="price"
                    className="font-semibold text-gray-700"
                  >
                    Price (PKR)
                  </label>
                  <input
                    id="price"
                    type="number"
                    placeholder="Enter product price"
                    name="price"
                    value={data.price}
                    onChange={handleChange}
                    required
                    className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 outline-none border border-purple-200 focus:border-purple-400 rounded-lg shadow-sm transition-all duration-300"
                  />
                </div>

                <div className="grid gap-2">
                  <label
                    htmlFor="discount"
                    className="font-semibold text-gray-700"
                  >
                    Discount (%)
                  </label>
                  <input
                    id="discount"
                    type="number"
                    placeholder="Enter discount percentage"
                    name="discount"
                    value={data.discount}
                    onChange={handleChange}
                    required
                    className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 outline-none border border-purple-200 focus:border-purple-400 rounded-lg shadow-sm transition-all duration-300"
                  />
                </div>
              </div>

              {/**add more field**/}
              {Object?.keys(data?.more_details)?.length > 0 && (
                <div className="border-t border-purple-200 pt-6">
                  <h3 className="font-semibold text-gray-700 mb-4">
                    Additional Details
                  </h3>
                  <div className="grid gap-4">
                    {Object?.keys(data?.more_details)?.map((k, index) => {
                      return (
                        <div key={k + index} className="grid gap-2">
                          <label
                            htmlFor={k}
                            className="font-medium text-gray-600 capitalize"
                          >
                            {k.replace('_', ' ')}
                          </label>
                          <input
                            id={k}
                            type="text"
                            value={data?.more_details[k]}
                            onChange={(e) => {
                              const value = e.target.value;
                              setData((preve) => {
                                return {
                                  ...preve,
                                  more_details: {
                                    ...preve.more_details,
                                    [k]: value,
                                  },
                                };
                              });
                            }}
                            required
                            className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 outline-none border border-purple-200 focus:border-purple-400 rounded-lg shadow-sm transition-all duration-300"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-purple-200">
                <button
                  type="button"
                  onClick={() => setOpenAddField(true)}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-3 px-6 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 text-center"
                >
                  Add Custom Field
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-6 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>

          {ViewImageURL && (
            <ViewImage url={ViewImageURL} close={() => setViewImageURL('')} />
          )}

          {openAddField && (
            <AddFieldComponent
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              submit={handleAddField}
              close={() => setOpenAddField(false)}
            />
          )}
        </section>
      </div>
    </section>
  );
};

export default EditProductAdmin;
