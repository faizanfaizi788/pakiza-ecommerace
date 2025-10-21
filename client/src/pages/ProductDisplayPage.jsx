import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa6';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import Divider from '../components/Divider';
import image1 from '../assets/minute_delivery.png';
import image2 from '../assets/Best_Prices_Offers.png';
import image3 from '../assets/Wide_Assortment.png';
import { pricewithDiscount } from '../utils/PriceWithDiscount';
import AddToCartButton from '../components/AddToCartButton';

const ProductDisplayPage = () => {
  const params = useParams();
  let productId = params?.product?.split('-')?.slice(-1)[0];
  const [data, setData] = useState({
    name: '',
    image: [],
  });
  const [image, setImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const imageContainer = useRef();

  const fetchProductDetails = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: {
          productId: productId,
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
    fetchProductDetails();
  }, [params]);

  const handleScrollRight = () => {
    imageContainer.current.scrollLeft += 100;
  };
  const handleScrollLeft = () => {
    imageContainer.current.scrollLeft -= 100;
  };
  console.log('product data', data);
  return (
    <section className="container mx-auto p-4 grid lg:grid-cols-2 min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="">
        <div className="bg-gradient-to-r from-white to-purple-50 lg:min-h-[65vh] lg:max-h-[65vh] rounded-xl shadow-lg border border-purple-200 min-h-56 max-h-56 h-full w-full">
          <img
            src={data.image[image]}
            className="w-full h-full object-scale-down p-4"
          />
        </div>
        <div className="flex items-center justify-center gap-3 my-4">
          {data.image.map((img, index) => {
            return (
              <div
                key={img + index + 'point'}
                className={`bg-purple-200 w-3 h-3 lg:w-5 lg:h-5 rounded-full transition-all ${
                  index === image && 'bg-purple-500'
                }`}
              ></div>
            );
          })}
        </div>
        <div className="grid relative">
          <div
            ref={imageContainer}
            className="flex gap-4 z-10 relative w-full overflow-x-auto scrollbar-none"
          >
            {data.image.map((img, index) => {
              return (
                <div
                  className="w-20 h-20 min-h-20 min-w-20 scr cursor-pointer shadow-lg rounded-xl border border-purple-200 bg-gradient-to-r from-white to-purple-50 transition-all hover:shadow-xl"
                  key={img + index}
                >
                  <img
                    src={img}
                    alt="min-product"
                    onClick={() => setImage(index)}
                    className="w-full h-full object-scale-down p-2 rounded-xl"
                  />
                </div>
              );
            })}
          </div>
          <div className="w-full -ml-3 h-full hidden lg:flex justify-between absolute  items-center">
            <button
              onClick={handleScrollLeft}
              className="z-10 bg-gradient-to-r from-purple-600 to-blue-600 text-white relative p-2 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <FaAngleLeft />
            </button>
            <button
              onClick={handleScrollRight}
              className="z-10 bg-gradient-to-r from-purple-600 to-blue-600 text-white relative p-2 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <FaAngleRight />
            </button>
          </div>
        </div>
        <div></div>

        <div className="my-6 hidden lg:grid gap-4 bg-gradient-to-r from-white to-purple-50 p-6 rounded-xl shadow-lg border border-purple-200">
          <div>
            <p className="font-semibold text-purple-700">Description</p>
            <p className="text-base text-gray-700">{data.description}</p>
          </div>
          <div>
            <p className="font-semibold text-purple-700">Unit</p>
            <p className="text-base text-gray-700">{data.unit}</p>
          </div>
          {data?.more_details &&
            Object.keys(data?.more_details).map((element, index) => {
              return (
                <div key={element}>
                  <p className="font-semibold text-purple-700">{element}</p>
                  <p className="text-base text-gray-700">
                    {data?.more_details[element]}
                  </p>
                </div>
              );
            })}
        </div>
      </div>

      <div className="p-4 lg:pl-7 text-base lg:text-lg">
        <p className="bg-gradient-to-r from-purple-600 to-blue-600 text-white w-fit px-3 py-1 rounded-full text-sm font-semibold">
          10 Min
        </p>
        <h2 className="text-lg font-semibold lg:text-3xl text-purple-800 my-2">
          {data.name}
        </h2>
        <p className="">{data.unit}</p>
        <Divider />
        <div>
          <p className="">Price</p>
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="border border-green-600 px-4 py-2 rounded bg-green-50 w-fit">
              <p className="font-semibold text-lg lg:text-xl">
                {DisplayPriceInRupees(
                  pricewithDiscount(data.price, data.discount)
                )}
              </p>
            </div>
            {data.discount && (
              <p className="line-through">{DisplayPriceInRupees(data.price)}</p>
            )}
            {data.discount && (
              <p className="font-bold text-green-600 lg:text-2xl">
                {data.discount}%{' '}
                <span className="text-base text-neutral-500">Discount</span>
              </p>
            )}
          </div>
        </div>

        {data.stock === 0 ? (
          <p className="text-lg text-red-500 my-4 font-semibold">
            Out of Stock
          </p>
        ) : (
          // <button className='my-4 px-4 py-1 bg-green-600 hover:bg-green-700 text-white rounded'>Add</button>
          <div className="my-6">
            <AddToCartButton data={data} />
          </div>
        )}

        <h2 className="font-semibold text-purple-700 text-lg mb-4">
          Why shop from Pakiza?{' '}
        </h2>
        <div className="bg-gradient-to-r from-white to-purple-50 p-6 rounded-xl shadow-lg border border-purple-200">
          <div className="flex  items-center gap-4 my-4">
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-2 rounded-xl">
              <img
                src={image1}
                alt="superfast delivery"
                className="w-16 h-16"
              />
            </div>
            <div className="text-sm">
              <div className="font-semibold text-purple-700">
                Superfast Delivery
              </div>
              <p className="text-gray-600">
                Get your order delivered to your doorstep at the earliest from
                dark stores near you.
              </p>
            </div>
          </div>
          <div className="flex  items-center gap-4 my-4">
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-2 rounded-xl">
              <img
                src={image2}
                alt="Best prices offers"
                className="w-16 h-16"
              />
            </div>
            <div className="text-sm">
              <div className="font-semibold text-purple-700">
                Best Prices & Offers
              </div>
              <p className="text-gray-600">
                Best price destination with offers directly from the
                manufacturers.
              </p>
            </div>
          </div>
          <div className="flex  items-center gap-4 my-4">
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-2 rounded-xl">
              <img src={image3} alt="Wide Assortment" className="w-16 h-16" />
            </div>
            <div className="text-sm">
              <div className="font-semibold text-purple-700">
                Wide Assortment
              </div>
              <p className="text-gray-600">
                Choose from 5000+ products across food personal care, household
                & other categories.
              </p>
            </div>
          </div>
        </div>

        {/****only mobile */}
        <div className="my-6 grid gap-4 bg-gradient-to-r from-white to-purple-50 p-6 rounded-xl shadow-lg border border-purple-200 lg:hidden">
          <div>
            <p className="font-semibold text-purple-700">Description</p>
            <p className="text-base text-gray-700">{data.description}</p>
          </div>
          <div>
            <p className="font-semibold text-purple-700">Unit</p>
            <p className="text-base text-gray-700">{data.unit}</p>
          </div>
          {data?.more_details &&
            Object.keys(data?.more_details).map((element, index) => {
              return (
                <div key={element}>
                  <p className="font-semibold text-purple-700">{element}</p>
                  <p className="text-base text-gray-700">
                    {data?.more_details[element]}
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default ProductDisplayPage;
