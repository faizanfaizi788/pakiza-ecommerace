import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import CardLoading from './CardLoading';
import CardProduct from './CardProduct';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { valideURLConvert } from '../utils/valideURLConvert';

const CategoryWiseProductDisplay = ({ id, name }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef();
  const subCategoryData = useSelector((state) => state.product.allSubCategory);
  const loadingCardNumber = new Array(6).fill(null);

  const fetchCategoryWiseProduct = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategory,
        data: {
          id: id,
        },
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
    fetchCategoryWiseProduct();
  }, []);

  const handleScrollRight = () => {
    containerRef.current.scrollLeft += 200;
  };

  const handleScrollLeft = () => {
    containerRef.current.scrollLeft -= 200;
  };

  // Check if scrolling is needed (more items than can fit in view)
  const [showScrollButtons, setShowScrollButtons] = useState(false);

  useEffect(() => {
    const checkScrollNeeded = () => {
      if (containerRef.current) {
        const { scrollWidth, clientWidth } = containerRef.current;
        setShowScrollButtons(scrollWidth > clientWidth && data.length > 1);
      }
    };

    checkScrollNeeded();
    window.addEventListener('resize', checkScrollNeeded);
    return () => window.removeEventListener('resize', checkScrollNeeded);
  }, [data]);

  const handleRedirectProductListpage = () => {
    const subcategory = subCategoryData.find((sub) => {
      const filterData = sub.category.some((c) => {
        return c._id == id;
      });

      return filterData ? true : null;
    });
    const url = `/${valideURLConvert(name)}-${id}/${valideURLConvert(
      subcategory?.name
    )}-${subcategory?._id}`;

    return url;
  };

  const redirectURL = handleRedirectProductListpage();
  return (
    <div className="bg-gradient-to-br from-white to-purple-50 mx-2 rounded-xl shadow-lg border border-purple-100 my-4">
      <div className="container mx-auto p-4 flex items-center justify-between gap-4">
        <h3 className="font-semibold text-lg md:text-xl bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent">
          {name}
        </h3>
        <Link
          to={redirectURL}
          className="text-purple-600 hover:text-purple-400 font-medium transition-colors duration-300"
        >
          See All
        </Link>
      </div>
      <div className="relative">
        <div
          className="flex gap-4 md:gap-6 lg:gap-8 container mx-auto px-4 pb-4 overflow-x-auto scrollbar-none scroll-smooth"
          ref={containerRef}
        >
          {loading &&
            loadingCardNumber.map((_, index) => {
              return (
                <CardLoading key={'CategorywiseProductDisplay123' + index} />
              );
            })}

          {data.map((p, index) => {
            return (
              <CardProduct
                data={p}
                key={p._id + 'CategorywiseProductDisplay' + index}
              />
            );
          })}
        </div>

        {/* Scroll buttons - only show when needed and content overflows */}
        {showScrollButtons && (
          <div className="absolute top-1/2 transform -translate-y-1/2 w-full px-2 hidden lg:flex justify-between pointer-events-none">
            <button
              onClick={handleScrollLeft}
              className="pointer-events-auto z-10 bg-gradient-to-r from-white to-purple-50 hover:from-purple-100 hover:to-blue-100 shadow-lg text-lg p-3 rounded-full border border-purple-200 transition-all duration-300"
            >
              <FaAngleLeft className="text-purple-600" />
            </button>
            <button
              onClick={handleScrollRight}
              className="pointer-events-auto z-10 bg-gradient-to-r from-white to-purple-50 hover:from-purple-100 hover:to-blue-100 shadow-lg p-3 text-lg rounded-full border border-purple-200 transition-all duration-300"
            >
              <FaAngleRight className="text-purple-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryWiseProductDisplay;
