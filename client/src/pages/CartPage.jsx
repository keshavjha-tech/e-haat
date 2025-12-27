import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/api/axiosInstance';
import summaryApi from '@/api/summaryApi';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { BsTrash, BsPlus, BsDash } from 'react-icons/bs';
import { Link } from 'react-router-dom';

function CartPage() {
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!user?.user?._id) {
      toast.error("Please login to view your cart");
      navigate('/login');
      return;
    }

    fetchCart();
  }, [user, navigate]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance({
        ...summaryApi.getCart
      });

      if (res?.data?.statusCode === 200) {
        setCart(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch cart: ", error);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(productId);
      return;
    }

    try {
      setUpdating(true);
      const res = await axiosInstance({
        ...summaryApi.updateCartItem,
        data: {
          productId,
          quantity: newQuantity
        }
      });

      if (res?.data?.statusCode === 200) {
        await fetchCart();
        toast.success("Cart updated");
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (error) {
      console.error("Failed to update cart: ", error);
      toast.error(error?.response?.data?.message || "Failed to update cart");
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      setUpdating(true);
      const res = await axiosInstance({
        ...summaryApi.removeFromCart(productId)
      });

      if (res?.data?.statusCode === 200) {
        await fetchCart();
        toast.success("Item removed from cart");
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (error) {
      console.error("Failed to remove item: ", error);
      toast.error(error?.response?.data?.message || "Failed to remove item");
    } finally {
      setUpdating(false);
    }
  };

  const clearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) {
      return;
    }

    try {
      setUpdating(true);
      const res = await axiosInstance({
        ...summaryApi.clearCart
      });

      if (res?.data?.statusCode === 200) {
        await fetchCart();
        toast.success("Cart cleared");
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (error) {
      console.error("Failed to clear cart: ", error);
      toast.error("Failed to clear cart");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className='container mx-auto p-4'>
        <div className='flex justify-center items-center min-h-[400px]'>
          <div className='text-xl'>Loading cart...</div>
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className='container mx-auto p-4'>
        <h1 className='text-3xl font-bold mb-6'>Shopping Cart</h1>
        <div className='text-center py-12'>
          <p className='text-gray-500 text-lg mb-4'>Your cart is empty</p>
          <Link 
            to="/"
            className='inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700'
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-4 md:p-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Shopping Cart</h1>
        {cart.items.length > 0 && (
          <button
            onClick={clearCart}
            disabled={updating}
            className='text-red-600 hover:text-red-700 disabled:opacity-50'
          >
            Clear Cart
          </button>
        )}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Cart Items */}
        <div className='lg:col-span-2 space-y-4'>
          {cart.items.map((item) => {
            if (!item.product) return null;
            
            const product = item.product;
            const itemTotal = product.price * item.quantity;

            return (
              <div key={item.product._id} className='border rounded-lg p-4 flex gap-4'>
                <Link to={`/product/${product._id}`} className='flex-shrink-0'>
                  <img
                    src={product.images?.[0]?.url || '/placeholder-image.jpg'}
                    alt={product.name}
                    className='w-24 h-24 object-cover rounded'
                  />
                </Link>
                
                <div className='flex-1'>
                  <Link to={`/product/${product._id}`}>
                    <h3 className='font-semibold text-lg hover:text-blue-600'>
                      {product.name}
                    </h3>
                  </Link>
                  <p className='text-gray-600 text-sm mt-1'>
                    ${product.price.toFixed(2)} each
                  </p>
                  
                  <div className='flex items-center gap-4 mt-4'>
                    {/* Quantity Controls */}
                    <div className='flex items-center border rounded-lg'>
                      <button
                        onClick={() => updateQuantity(product._id, item.quantity - 1)}
                        disabled={updating || item.quantity <= 1}
                        className='px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        <BsDash />
                      </button>
                        <span className='px-4 py-1 border-x'>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(product._id, item.quantity + 1)}
                        disabled={updating || item.quantity >= product.stock}
                        className='px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        <BsPlus />
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className='text-lg font-semibold'>
                      ${itemTotal.toFixed(2)}
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(product._id)}
                      disabled={updating}
                      className='ml-auto text-red-600 hover:text-red-700 disabled:opacity-50'
                    >
                      <BsTrash className='text-xl' />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className='lg:col-span-1'>
          <div className='border rounded-lg p-6 sticky top-4'>
            <h2 className='text-2xl font-bold mb-4'>Order Summary</h2>
            
            <div className='space-y-3 mb-4'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Subtotal</span>
                <span className='font-semibold'>${cart.summary?.subtotal || '0.00'}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Discount</span>
                <span className='font-semibold'>-${cart.summary?.discount || '0.00'}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Shipping</span>
                <span className='font-semibold'>Free</span>
              </div>
              <div className='border-t pt-3 flex justify-between text-lg'>
                <span className='font-bold'>Total</span>
                <span className='font-bold'>${cart.summary?.total || '0.00'}</span>
              </div>
            </div>

            <button
              className='w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 mb-3'
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>
            
            <Link
              to="/"
              className='block text-center text-blue-600 hover:text-blue-700'
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;

