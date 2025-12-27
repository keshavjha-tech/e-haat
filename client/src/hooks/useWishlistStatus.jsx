import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '@/api/axiosInstance';
import summaryApi from '@/api/summaryApi';
import { useSelector } from 'react-redux';

export function useWishlistStatus(productId) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state?.user);

  const checkStatus = useCallback(async () => {
    if (!user?.user?._id || !productId) {
      setIsInWishlist(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance({
        ...summaryApi.checkWishlistStatus(productId)
      });

      if (res?.data?.statusCode === 200) {
        setIsInWishlist(res.data.data.isInWishlist);
      }
    } catch (error) {
      setIsInWishlist(false);
    } finally {
      setLoading(false);
    }
  }, [user?.user?._id, productId]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  useEffect(() => {
    // Listen for wishlist update events
    const handleWishlistUpdate = () => {
      checkStatus();
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, [checkStatus]);

  return { isInWishlist, loading, refreshStatus: checkStatus };
}

