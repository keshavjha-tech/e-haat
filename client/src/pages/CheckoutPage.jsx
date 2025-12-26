import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/api/axiosInstance';
import summaryApi from '@/api/summaryApi';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { loadRazorpay } from '@/utils/loadRazorpay';
import { MdLocationOn, MdPhone, MdEmail, MdLock } from 'react-icons/md';
import { FaArrowLeft } from 'react-icons/fa';

function CheckoutPage() {
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!user?.user?._id) {
      toast.error("Please login to checkout");
      navigate('/login');
      return;
    }

    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cartRes, addressesRes] = await Promise.all([
        axiosInstance({ ...summaryApi.getCart }),
        axiosInstance({ ...summaryApi.getAddresses })
      ]);

      if (cartRes?.data?.statusCode === 200) {
        setCart(cartRes.data.data);
      }

      if (addressesRes?.data?.statusCode === 200) {
        const addressList = addressesRes.data.data || [];
        setAddresses(addressList);
        
        // Auto-select default address or first address
        const defaultAddress = addressList.find(addr => addr.isDefault) || addressList[0];
        if (defaultAddress) {
          setSelectedAddress(defaultAddress._id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch data: ", error);
      toast.error("Failed to load checkout data");
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    if (!cart || !cart.items) return { itemsPrice: 0, shippingPrice: 0, discountPrice: 0, totalPrice: 0 };

    let itemsPrice = 0;
    cart.items.forEach(item => {
      if (item.product) {
        const itemPrice = item.product.discount > 0
          ? item.product.price - (item.product.price * item.product.discount / 100)
          : item.product.price;
        itemsPrice += itemPrice * item.quantity;
      }
    });

    const shippingPrice = itemsPrice > 499 ? 0 : 50;
    const discountPrice = 0;
    const totalPrice = itemsPrice + shippingPrice - discountPrice;

    return { itemsPrice, shippingPrice, discountPrice, totalPrice };
  };

  const handlePayment = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    if (!cart || cart.items.length === 0) {
      toast.error("Your cart is empty");
      navigate('/cart');
      return;
    }

    try {
      setProcessing(true);

      // Load Razorpay script
      await loadRazorpay();

      // Create Razorpay order
      const orderRes = await axiosInstance({
        ...summaryApi.createRazorpayOrder,
        data: {
          addressId: selectedAddress
        }
      });

      if (orderRes?.data?.statusCode !== 200) {
        throw new Error(orderRes?.data?.message || "Failed to create order");
      }

      const { orderId, razorpayOrderId, amount, currency, key } = orderRes.data.data;

      // Initialize Razorpay checkout
      const options = {
        key: key,
        amount: amount,
        currency: currency,
        name: "eHaat",
        description: `Order #${orderId}`,
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyRes = await axiosInstance({
              ...summaryApi.verifyPayment,
              data: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderId
              }
            });

            if (verifyRes?.data?.statusCode === 200) {
              toast.success("Payment successful! Order confirmed.");
              window.dispatchEvent(new Event('cartUpdated'));
              navigate(`/orders?success=true`);
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification error: ", error);
            toast.error(error?.response?.data?.message || "Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user?.user?.name || "",
          email: user?.user?.email || "",
          contact: user?.user?.mobile || ""
        },
        theme: {
          color: "#2563eb"
        },
        modal: {
          ondismiss: function() {
            setProcessing(false);
            toast.error("Payment cancelled");
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
      razorpay.on('payment.failed', function (response) {
        console.error("Payment failed: ", response.error);
        toast.error(`Payment failed: ${response.error.description || "Unknown error"}`);
        setProcessing(false);
      });

    } catch (error) {
      console.error("Payment error: ", error);
      toast.error(error?.response?.data?.message || "Failed to initiate payment. Please try again.");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className='container mx-auto p-4'>
        <div className='flex justify-center items-center min-h-[400px]'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
            <div className='text-lg text-gray-600'>Loading checkout...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className='container mx-auto p-4'>
        <div className='text-center py-12'>
          <p className='text-gray-500 text-lg mb-4'>Your cart is empty</p>
          <button
            onClick={() => navigate('/')}
            className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700'
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className='container mx-auto p-4'>
        <button
          onClick={() => navigate(-1)}
          className='flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6'
        >
          <FaArrowLeft />
          Back
        </button>
        <div className='text-center py-12'>
          <p className='text-gray-500 text-lg mb-4'>Please add a delivery address first</p>
          <button
            onClick={() => navigate('/dashboard/addresses')}
            className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700'
          >
            Add Address
          </button>
        </div>
      </div>
    );
  }

  const totals = calculateTotals();
  const selectedAddressData = addresses.find(addr => addr._id === selectedAddress);

  return (
    <div className='container mx-auto p-4 md:p-8 max-w-6xl'>
      <button
        onClick={() => navigate(-1)}
        className='flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6'
      >
        <FaArrowLeft />
        Back to Cart
      </button>

      <h1 className='text-3xl font-bold mb-8'>Checkout</h1>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Left Column - Order Details */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Delivery Address */}
          <div className='bg-white rounded-lg shadow-md border border-gray-200 p-6'>
            <h2 className='text-xl font-bold mb-4'>Delivery Address</h2>
            <div className='space-y-3'>
              {addresses.map((address) => (
                <label
                  key={address._id}
                  className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedAddress === address._id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type='radio'
                    name='address'
                    value={address._id}
                    checked={selectedAddress === address._id}
                    onChange={(e) => setSelectedAddress(e.target.value)}
                    className='mt-1'
                  />
                  <div className='flex-1'>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='font-semibold'>{address.fullName}</span>
                      {address.isDefault && (
                        <span className='text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded'>
                          Default
                        </span>
                      )}
                    </div>
                    <p className='text-gray-600 text-sm'>
                      {address.addressLine1}
                      {address.addressLine2 && `, ${address.addressLine2}`}
                    </p>
                    <p className='text-gray-600 text-sm'>
                      {address.city}, {address.state} - {address.pinCode}
                    </p>
                    <p className='text-gray-600 text-sm'>{address.country}</p>
                    <p className='text-gray-600 text-sm mt-1 flex items-center gap-1'>
                      <MdPhone className='text-xs' />
                      {address.mobile}
                    </p>
                  </div>
                </label>
              ))}
            </div>
            <button
              onClick={() => navigate('/dashboard/addresses')}
              className='mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium'
            >
              + Add New Address
            </button>
          </div>

          {/* Order Items */}
          <div className='bg-white rounded-lg shadow-md border border-gray-200 p-6'>
            <h2 className='text-xl font-bold mb-4'>Order Items</h2>
            <div className='space-y-4'>
              {cart.items.map((item) => {
                if (!item.product) return null;
                const product = item.product;
                const itemPrice = product.discount > 0
                  ? product.price - (product.price * product.discount / 100)
                  : product.price;
                const itemTotal = itemPrice * item.quantity;

                return (
                  <div key={item.product._id} className='flex gap-4 pb-4 border-b last:border-0'>
                    <img
                      src={product.images?.[0]?.url || '/placeholder-image.jpg'}
                      alt={product.name}
                      className='w-20 h-20 object-cover rounded'
                    />
                    <div className='flex-1'>
                      <h3 className='font-semibold'>{product.name}</h3>
                      <p className='text-gray-600 text-sm'>Quantity: {item.quantity}</p>
                      <p className='text-gray-900 font-semibold mt-1'>
                        ₹{itemPrice.toFixed(2)} × {item.quantity} = ₹{itemTotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className='lg:col-span-1'>
          <div className='bg-white rounded-lg shadow-md border border-gray-200 p-6 sticky top-4'>
            <h2 className='text-xl font-bold mb-4'>Order Summary</h2>
            
            <div className='space-y-3 mb-6'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Items Total</span>
                <span className='font-semibold'>₹{totals.itemsPrice.toFixed(2)}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Shipping</span>
                <span className='font-semibold'>
                  {totals.shippingPrice === 0 ? 'Free' : `₹${totals.shippingPrice.toFixed(2)}`}
                </span>
              </div>
              {totals.discountPrice > 0 && (
                <div className='flex justify-between text-green-600'>
                  <span>Discount</span>
                  <span className='font-semibold'>-₹{totals.discountPrice.toFixed(2)}</span>
                </div>
              )}
              <div className='border-t pt-3 flex justify-between text-lg'>
                <span className='font-bold'>Total</span>
                <span className='font-bold'>₹{totals.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={processing || !selectedAddress}
              className='w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4'
            >
              {processing ? (
                <>
                  <span className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></span>
                  Processing...
                </>
              ) : (
                <>
                  <MdLock />
                  Pay ₹{totals.totalPrice.toFixed(2)}
                </>
              )}
            </button>

            <div className='flex items-center gap-2 text-xs text-gray-500'>
              <MdLock />
              <span>Secure payment powered by Razorpay</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;

