import React, { useEffect, useState } from 'react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { Link, useParams } from 'react-router-dom';
import AxiosToastError from '../utils/AxiosToastError';
import Loading from '../components/Loading';
import CardProduct from '../components/CardProduct';
import { useSelector } from 'react-redux';
import { valideURLConvert } from '../utils/valideURLConvert';

const ProductListPage = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const params = useParams();
  const AllSubCategory = useSelector((state) => state.product.allSubCategory);
  const [DisplaySubCatory, setDisplaySubCategory] = useState([]);

  console.log(AllSubCategory);

  const subCategory = params?.subCategory?.split('-');
  const subCategoryName = subCategory
    ?.slice(0, subCategory?.length - 1)
    ?.join(' ');

  const categoryId = params.category.split('-').slice(-1)[0];
  const subCategoryId = params.subCategory.split('-').slice(-1)[0];

  const fetchProductdata = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          page: page,
          limit: 8,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        if (responseData.page == 1) {
          setData(responseData.data);
        } else {
          setData([...data, ...responseData.data]);
        }
        setTotalPage(responseData.totalCount);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductdata();
  }, [params]);

  useEffect(() => {
    const sub = AllSubCategory.filter((s) => {
      const filterData = s.category.some((el) => {
        return el._id == categoryId;
      });

      return filterData ? filterData : null;
    });
    setDisplaySubCategory(sub);
  }, [params, AllSubCategory]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <div className="container mx-auto grid grid-cols-[120px,1fr] md:grid-cols-[280px,1fr] lg:grid-cols-[320px,1fr] gap-4 p-4">
        {/**sub category **/}
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg border border-purple-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4">
            <h2 className="text-white font-bold text-lg text-center lg:text-left">
              Categories
            </h2>
          </div>
          <div className="min-h-[80vh] max-h-[80vh] overflow-y-auto scrollbarCustom">
            {DisplaySubCatory.map((s, index) => {
              const link = `/${valideURLConvert(s?.category[0]?.name)}-${
                s?.category[0]?._id
              }/${valideURLConvert(s.name)}-${s._id}`;
              return (
                <Link
                  key={s._id}
                  to={link}
                  className={`flex items-center p-4 border-b border-purple-100 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300 cursor-pointer
                    ${
                      subCategoryId === s._id
                        ? 'bg-gradient-to-r from-purple-100 to-blue-100 border-l-4 border-l-purple-500'
                        : ''
                    }
                  `}
                >
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 flex items-center justify-center mr-3 lg:mr-4 flex-shrink-0 shadow-sm">
                    <img
                      src={s.image}
                      alt="subCategory"
                      className="w-12 h-12 lg:w-16 lg:h-16 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0 hidden lg:block">
                    <p className="text-gray-800 font-semibold text-sm lg:text-base truncate">
                      {s.name}
                    </p>
                    <p className="text-purple-600 text-xs">
                      {s?.category[0]?.name}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/**Product **/}
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg border border-purple-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 sticky top-0 z-10">
            <h3 className="text-white font-bold text-lg">
              {subCategoryName || 'Products'}
            </h3>
          </div>
          <div className="min-h-[80vh] max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 gap-4">
              {data.map((p, index) => {
                return (
                  <CardProduct
                    data={p}
                    key={p._id + 'productSubCategory' + index}
                  />
                );
              })}
            </div>

            {data.length === 0 && !loading && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <p className="text-purple-600 font-semibold text-lg">
                    No Products Found
                  </p>
                  <p className="text-gray-500 text-sm">
                    Try selecting a different category
                  </p>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loading />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListPage;
