import React, { useEffect, useState } from 'react';
import UploadSubCategoryModel from '../components/UploadSubCategoryModel';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import DisplayTable from '../components/DisplayTable';
import { createColumnHelper } from '@tanstack/react-table';
import ViewImage from '../components/ViewImage';
import { LuPencil } from 'react-icons/lu';
import { MdDelete } from 'react-icons/md';
import { HiPencil } from 'react-icons/hi';
import EditSubCategory from '../components/EditSubCategory';
import CofirmBox from '../components/CofirmBox';
import toast from 'react-hot-toast';

const SubCategoryPage = () => {
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const columnHelper = createColumnHelper();
  const [ImageURL, setImageURL] = useState('');
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({
    _id: '',
  });
  const [deleteSubCategory, setDeleteSubCategory] = useState({
    _id: '',
  });
  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);

  const fetchSubCategory = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getSubCategory,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategory();
  }, []);

  const column = [
    columnHelper.accessor('name', {
      header: 'Name',
    }),
    columnHelper.accessor('image', {
      header: 'Image',
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center">
            <img
              src={row.original.image}
              alt={row.original.name}
              className="w-12 h-12 rounded-lg object-cover cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 border border-purple-200"
              onClick={() => {
                setImageURL(row.original.image);
              }}
            />
          </div>
        );
      },
    }),
    columnHelper.accessor('category', {
      header: 'Category',
      cell: ({ row }) => {
        return (
          <div className="flex flex-wrap gap-1">
            {row.original.category.map((c, index) => {
              return (
                <span
                  key={c._id + 'table'}
                  className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 px-2 py-1 rounded-lg text-xs font-medium border border-purple-200 shadow-sm inline-block"
                >
                  {c.name}
                </span>
              );
            })}
          </div>
        );
      },
    }),
    columnHelper.accessor('_id', {
      header: 'Action',
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setOpenEdit(true);
                setEditData(row.original);
              }}
              className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <HiPencil size={16} />
            </button>
            <button
              onClick={() => {
                setOpenDeleteConfirmBox(true);
                setDeleteSubCategory(row.original);
              }}
              className="p-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <MdDelete size={16} />
            </button>
          </div>
        );
      },
    }),
  ];

  const handleDeleteSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteSubCategory,
        data: deleteSubCategory,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        fetchSubCategory();
        setOpenDeleteConfirmBox(false);
        setDeleteSubCategory({ _id: '' });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <div className="p-4 sm:p-6 bg-gradient-to-br from-white to-purple-50 shadow-lg rounded-xl m-4 border border-purple-100 flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent">
          Sub Category Management
        </h2>
        <button
          onClick={() => setOpenAddSubCategory(true)}
          className="text-sm bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium"
        >
          Add Sub Category
        </button>
      </div>

      <div className="m-4 bg-gradient-to-br from-white to-purple-50 shadow-lg rounded-xl border border-purple-100 overflow-hidden">
        <div className="overflow-auto w-full">
          <DisplayTable data={data} column={column} />
        </div>
      </div>

      {openAddSubCategory && (
        <UploadSubCategoryModel
          close={() => setOpenAddSubCategory(false)}
          fetchData={fetchSubCategory}
        />
      )}

      {ImageURL && <ViewImage url={ImageURL} close={() => setImageURL('')} />}

      {openEdit && (
        <EditSubCategory
          data={editData}
          close={() => setOpenEdit(false)}
          fetchData={fetchSubCategory}
        />
      )}

      {openDeleteConfirmBox && (
        <CofirmBox
          cancel={() => setOpenDeleteConfirmBox(false)}
          close={() => setOpenDeleteConfirmBox(false)}
          confirm={handleDeleteSubCategory}
        />
      )}
    </section>
  );
};

export default SubCategoryPage;
