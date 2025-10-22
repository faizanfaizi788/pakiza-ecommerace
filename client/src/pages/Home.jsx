import React, { useState, useEffect } from 'react';
import banner1 from '../assets/banner_1.jpg';
import banner2 from '../assets/banner_2.jpg';
import banner3 from '../assets/banner_3.jpg';
import { useSelector } from 'react-redux';
import { valideURLConvert } from '../utils/valideURLConvert';
import { Link, useNavigate } from 'react-router-dom';
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay';

const Home = () => {
  const loadingCategory = useSelector((state) => state.product.loadingCategory);
  const categoryData = useSelector((state) => state.product.allCategory);
  const subCategoryData = useSelector((state) => state.product.allSubCategory);
  const navigate = useNavigate();

  // Carousel state and setup
  const bannerImages = [banner1, banner2, banner3];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Auto-change images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  // Check if images are loaded
  useEffect(() => {
    const imagePromises = bannerImages.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = () => reject(src);
        img.src = src;
      });
    });

    Promise.all(imagePromises)
      .then(() => setImagesLoaded(true))
      .catch(() => setImagesLoaded(true)); // Show even if some images fail
  }, []);

  const handleRedirectProductListpage = (id, cat) => {
    console.log(id, cat);
    const subcategory = subCategoryData.find((sub) => {
      const filterData = sub.category.some((c) => {
        return c._id == id;
      });

      return filterData ? true : null;
    });
    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(
      subcategory.name
    )}-${subcategory._id}`;

    navigate(url);
    console.log(url);
  };

  return (
    <section className="bg-gradient-to-br from-white via-blue-50 to-purple-50 min-h-screen">
      <div className="container mx-auto px-4 py-4">
        <div className="relative w-full h-64 md:h-80 lg:h-50 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl shadow-lg overflow-hidden">
          {/* Loading state */}
          {!imagesLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl">
              <div className="animate-pulse text-purple-600 font-semibold">
                Loading...
              </div>
            </div>
          )}

          {/* Carousel Images */}
          <div className="relative w-full h-full">
            {bannerImages.map((image, index) => (
              <img
                key={index}
                src={image}
                className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentImageIndex && imagesLoaded
                    ? 'opacity-100'
                    : 'opacity-0'
                }`}
                alt={`banner ${index + 1}`}
                loading="eager"
                onError={(e) => {
                  console.log(`Failed to load image: ${image}`);
                  e.target.style.display = 'none';
                }}
              />
            ))}
          </div>

          {/* Carousel Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {bannerImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? 'bg-white shadow-lg scale-110'
                    : 'bg-white/60 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 my-2 grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10  gap-2">
        {loadingCategory
          ? new Array(12).fill(null).map((c, index) => {
              return (
                <div
                  key={index + 'loadingcategory'}
                  className="bg-gradient-to-br from-white to-purple-50 rounded-xl p-4 min-h-36 grid gap-2 shadow-lg animate-pulse border border-purple-100"
                >
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 min-h-24 rounded-lg"></div>
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 h-8 rounded-lg"></div>
                </div>
              );
            })
          : categoryData.map((cat, index) => {
              return (
                <div
                  key={cat._id + 'displayCategory'}
                  className="w-full h-full cursor-pointer hover:scale-105 transition-all duration-300"
                  onClick={() =>
                    handleRedirectProductListpage(cat._id, cat.name)
                  }
                >
                  <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl p-3 shadow-lg hover:shadow-xl border border-purple-100 transition-all duration-300">
                    <img
                      src={cat.image}
                      className="w-full h-full object-scale-down rounded-lg"
                    />
                  </div>
                </div>
              );
            })}
      </div>

      {/***display category product */}
      {categoryData?.map((c, index) => {
        return (
          <CategoryWiseProductDisplay
            key={c?._id + 'CategorywiseProduct'}
            id={c?._id}
            name={c?.name}
          />
        );
      })}
    </section>
  );
};

export default Home;
