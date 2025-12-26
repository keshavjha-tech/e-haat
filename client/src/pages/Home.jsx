import axiosInstance from '@/api/axiosInstance';
import summaryApi from '@/api/summaryApi';
import ProductCard from '@/components/ProductCard';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const res = await axiosInstance({
        ...summaryApi.categories
      });
      
      if (res?.data?.statusCode === 200) {
        setCategories(res.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch categories: ", error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: 1,
        limit: 20
      };
      
      if (selectedCategory) {
        params.category = selectedCategory;
      }

      const res = await axiosInstance({
        ...summaryApi.products,
        params
      });
      
      if (res?.data?.statusCode === 200) {
        setProducts(res.data.data.products || []);
        setPagination(res.data.data.pagination || {});
      }
    } catch (error) {
      console.error("Failed to fetch products: ", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='container mx-auto p-4'>
        <div className='flex justify-center items-center min-h-[400px]'>
          <div className='text-xl'>Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8'>
      {/* Categories Section */}
      {!categoriesLoading && categories.length > 0 && (
        <div className='mb-8 sm:mb-10 lg:mb-12'>
          <div className='flex items-center gap-3 mb-4 sm:mb-6'>
            <div className='h-1 w-12 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full hidden sm:block'></div>
            <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900'>
              Shop by Category
            </h2>
            <div className='h-1 flex-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full hidden sm:block'></div>
          </div>
          <div className='flex gap-2 sm:gap-3 lg:gap-4 overflow-x-auto pb-2 sm:pb-4 scrollbar-hide'>
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex-shrink-0 px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 rounded-lg sm:rounded-xl whitespace-nowrap transition-all duration-200 font-medium text-sm sm:text-base ${
                selectedCategory === null
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => setSelectedCategory(category._id)}
                className={`flex-shrink-0 px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 rounded-lg sm:rounded-xl whitespace-nowrap transition-all duration-200 font-medium text-sm sm:text-base ${
                  selectedCategory === category._id
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products Section */}
      <div>
        <div className='mb-4 sm:mb-6 lg:mb-8'>
          <h1 className='text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900'>
            {selectedCategory 
              ? `${categories.find(c => c._id === selectedCategory)?.name || 'Category'} Products`
              : 'Featured Products'
            }
          </h1>
          {products.length > 0 && (
            <p className='text-gray-500 text-sm sm:text-base mt-1'>
              {pagination.totalProducts || products.length} {pagination.totalProducts === 1 ? 'product' : 'products'} available
            </p>
          )}
        </div>
        {loading ? (
          <div className='flex justify-center items-center min-h-[400px]'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
              <div className='text-lg sm:text-xl text-gray-600'>Loading products...</div>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className='text-center py-12 sm:py-16 lg:py-20'>
            <div className='text-6xl sm:text-7xl mb-4'>📦</div>
            <p className='text-gray-500 text-lg sm:text-xl mb-2'>No products available at the moment.</p>
            <p className='text-gray-400 text-sm sm:text-base'>Check back later for new products!</p>
          </div>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6'>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home