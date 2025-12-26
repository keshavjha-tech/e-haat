import { useState, useEffect } from 'react';
import axiosInstance from '@/api/axiosInstance';
import summaryApi from '@/api/summaryApi';
import { useSelector } from 'react-redux';

export function useWishlistCount() {
  const [wishlistCount, setWishlistCount] = useState(0);
  const user = useSelector((state) => state?.user);

  const fetchWishlistCount = async () => {
    if (!user?.user?._id) {
      setWishlistCount(0);
      return;
    }

    try {
      const res = await axiosInstance({
        ...summaryApi.getWishlist
      });

      if (res?.data?.statusCode === 200) {
        setWishlistCount(res.data.data?.length || 0);
      }
    } catch (error) {
      setWishlistCount(0);
    }
  };

  useEffect(() => {
    fetchWishlistCount();

    // Listen for wishlist update events
    const handleWishlistUpdate = () => {
      fetchWishlistCount();
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, [user?.user?._id]);

  return { wishlistCount };
}

