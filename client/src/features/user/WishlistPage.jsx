import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/api/axiosInstance';
import summaryApi from '@/api/summaryApi';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import ProductCard from '@/components/ProductCard';
import { BsHeartFill } from 'react-icons/bs';
import { FaArrowLeft } from 'react-icons/fa6';
import useMobile from '@/hooks/useMobile';

function WishlistPage() {
  const [isMobile] = useMobile();
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.user?._id) {
      toast.error("Please login to view your wishlist");
      navigate('/login');
      return;
    }

    fetchWishlist();
  }, [user, navigate]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance({
        ...summaryApi.getWishlist
      });

      if (res?.data?.statusCode === 200) {
        setWishlist(res.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist: ", error);
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const res = await axiosInstance({
        ...summaryApi.removeFromWishlist(productId)
      });

      if (res?.data?.statusCode === 200) {
        toast.success("Removed from wishlist");
        fetchWishlist(); // Refresh wishlist
        window.dispatchEvent(new Event('wishlistUpdated'));
      }
    } catch (error) {
      console.error("Failed to remove from wishlist: ", error);
      toast.error(error?.response?.data?.message || "Failed to remove from wishlist");
    }
  };

  if (loading) {
    return (
      <div className='container mx-auto p-4'>
        <div className='flex justify-center items-center min-h-[400px]'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
            <div className='text-lg text-gray-600'>Loading wishlist...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-4 md:p-8'>
      {/* Mobile Header */}
      {isMobile && (
        <div className='p-4 border-b flex items-center gap-4 mb-6'>
          <button onClick={() => navigate(-1)} className='hover:text-blue-600 transition-colors'>
            <FaArrowLeft className='text-xl' />
          </button>
          <h1 className='text-2xl font-bold'>My Wishlist</h1>
        </div>
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <div className='mb-8'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='h-1 w-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full'></div>
            <h1 className='text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-3'>
              <BsHeartFill className='text-red-500' />
              My Wishlist
            </h1>
            <div className='h-1 flex-1 bg-gradient-to-r from-pink-500 to-red-500 rounded-full'></div>
          </div>
          {wishlist.length > 0 && (
            <p className='text-gray-600'>
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
            </p>
          )}
        </div>
      )}

      {/* Wishlist Content */}
      {wishlist.length === 0 ? (
        <div className='text-center py-16'>
          <div className='text-6xl mb-4'>💔</div>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>Your wishlist is empty</h2>
          <p className='text-gray-600 mb-6'>Start adding products you love!</p>
          <button
            onClick={() => navigate('/')}
            className='bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl'
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6'>
          {wishlist.map((product) => (
            <div key={product._id} className='relative group'>
              <ProductCard product={product} />
              <button
                onClick={() => handleRemoveFromWishlist(product._id)}
                className='absolute top-2 right-2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10'
                title='Remove from wishlist'
              >
                <BsHeartFill className='text-red-500 text-lg' />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
