import React, { useEffect, useState } from 'react';
import UploadCategoryModel from '../components/UploadCategoryModel';
import Loading from '../components/Loading';
import NoData from '../components/NoData';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import EditCategory from '../components/EditCategory';
import CofirmBox from '../components/CofirmBox';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { useSelector } from 'react-redux';

const CategoryPage = () => {
  const [openUploadCategory, setOpenUploadCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    image: '',
  });
  const [openConfimBoxDelete, setOpenConfirmBoxDelete] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState({
    _id: '',
  });
  // const allCategory = useSelector(state => state.product.allCategory)

  // useEffect(()=>{
  //     setCategoryData(allCategory)
  // },[allCategory])

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getCategory,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        setCategoryData(responseData.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleDeleteCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteCategory,
        data: deleteCategory,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        fetchCategory();
        setOpenConfirmBoxDelete(false);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <div className="p-4 sm:p-6 bg-gradient-to-br from-white to-purple-50 shadow-lg rounded-xl m-4 border border-purple-100 flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent">
          Category Management
        </h2>
        <button
          onClick={() => setOpenUploadCategory(true)}
          className="text-sm bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium"
        >
          Add Category
        </button>
      </div>
      {!categoryData[0] && !loading && (
        <div className="m-4">
          <NoData />
        </div>
      )}

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {categoryData.map((category, index) => {
          return (
            <div
              className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-purple-100 hover:border-purple-200"
              key={category._id}
            >
              <div className="h-40 overflow-hidden">
                <img
                  alt={category.name}
                  src={category.image}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-800 mb-2 text-center truncate">
                  {category.name}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setOpenEdit(true);
                      setEditData(category);
                    }}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium py-2 rounded-lg text-xs transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setOpenConfirmBoxDelete(true);
                      setDeleteCategory(category);
                    }}
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium py-2 rounded-lg text-xs transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {loading && <Loading />}

      {openUploadCategory && (
        <UploadCategoryModel
          fetchData={fetchCategory}
          close={() => setOpenUploadCategory(false)}
        />
      )}

      {openEdit && (
        <EditCategory
          data={editData}
          close={() => setOpenEdit(false)}
          fetchData={fetchCategory}
        />
      )}

      {openConfimBoxDelete && (
        <CofirmBox
          close={() => setOpenConfirmBoxDelete(false)}
          cancel={() => setOpenConfirmBoxDelete(false)}
          confirm={handleDeleteCategory}
        />
      )}
    </section>
  );
};

export default CategoryPage;
