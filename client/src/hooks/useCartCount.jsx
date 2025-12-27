import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '@/api/axiosInstance';
import summaryApi from '@/api/summaryApi';
import { useSelector } from 'react-redux';

export function useCartCount() {
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state?.user);

  const fetchCartCount = useCallback(async () => {
    if (!user?.user?._id) {
      setCartCount(0);
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance({
        ...summaryApi.getCart
      });

      if (res?.data?.statusCode === 200) {
        const items = res.data.data?.items || [];
        const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
        setCartCount(totalItems);
      }
    } catch (error) {
      // If cart doesn't exist or user not logged in, count is 0
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  }, [user?.user?._id]);

  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  useEffect(() => {
    // Listen for cart update events
    const handleCartUpdate = () => {
      fetchCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [fetchCartCount]);

  return { cartCount, loading, refreshCartCount: fetchCartCount };
}

