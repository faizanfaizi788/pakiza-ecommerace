import React, { useEffect, useState } from 'react';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import Loading from '../components/Loading';
import ProductCardAdmin from '../components/ProductCardAdmin';
import { IoSearchOutline } from 'react-icons/io5';
import EditProductAdmin from '../components/EditProductAdmin';

const ProductAdmin = () => {
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [search, setSearch] = useState('');

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: {
          page: page,
          limit: 12,
          search: search,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setTotalPageCount(responseData.totalNoPage);
        setProductData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [page]);

  const handleNext = () => {
    if (page !== totalPageCount) {
      setPage((preve) => preve + 1);
    }
  };
  const handlePrevious = () => {
    if (page > 1) {
      setPage((preve) => preve - 1);
    }
  };

  const handleOnChange = (e) => {
    const { value } = e.target;
    setSearch(value);
    setPage(1);
  };

  useEffect(() => {
    let flag = true;

    const interval = setTimeout(() => {
      if (flag) {
        fetchProductData();
        flag = false;
      }
    }, 300);

    return () => {
      clearTimeout(interval);
    };
  }, [search]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <div className="p-4 sm:p-6 bg-gradient-to-br from-white to-purple-50 shadow-lg rounded-xl m-4 border border-purple-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent">
          Product Management
        </h2>
        <div className="w-full sm:w-auto sm:min-w-64 sm:max-w-80 bg-gradient-to-r from-purple-50 to-blue-50 px-4 flex items-center gap-3 py-3 rounded-lg border border-purple-200 focus-within:border-purple-400 shadow-sm">
          <IoSearchOutline size={20} className="text-purple-600" />
          <input
            type="text"
            placeholder="Search product here ..."
            className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-500"
            value={search}
            onChange={handleOnChange}
          />
        </div>
      </div>
      {loading && (
        <div className="m-4">
          <Loading />
        </div>
      )}

      <div className="p-4 bg-gradient-to-br from-white to-purple-50 shadow-lg rounded-xl m-4 border border-purple-100">
        <div className="min-h-[55vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {productData.map((p, index) => {
              return (
                <ProductCardAdmin
                  key={p._id}
                  data={p}
                  fetchProductData={fetchProductData}
                />
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-purple-200">
          <button
            onClick={handlePrevious}
            disabled={page === 1}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 px-6 py-2 rounded-lg shadow-sm border border-purple-200">
            <span className="font-semibold text-purple-800">
              Page {page} of {totalPageCount}
            </span>
          </div>
          <button
            onClick={handleNext}
            disabled={page === totalPageCount}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductAdmin;
