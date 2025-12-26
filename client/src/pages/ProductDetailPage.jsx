import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '@/api/axiosInstance';
import summaryApi from '@/api/summaryApi';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { BsCartPlus, BsHeart, BsHeartFill } from 'react-icons/bs';
import { FaStar } from 'react-icons/fa';

function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance({
          ...summaryApi.productById(productId)
        });
        
        if (res?.data?.statusCode === 200) {
          setProduct(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch product: ", error);
        toast.error("Product not found");
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    
    if (productId) {
      fetchProduct();
    }
  }, [productId, navigate]);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!user?.user?._id || !productId) return;

      try {
        const res = await axiosInstance({
          ...summaryApi.checkWishlistStatus(productId)
        });

        if (res?.data?.statusCode === 200) {
          setIsInWishlist(res.data.data.isInWishlist);
        }
      } catch (error) {
        // Silently fail - user might not be logged in
        setIsInWishlist(false);
      }
    };

    checkWishlistStatus();
  }, [user?.user?._id, productId]);

  const handleAddToCart = async () => {
    if (!user?.user?._id) {
      toast.error("Please login to add items to cart");
      navigate('/login');
      return;
    }

    if (product.stock === 0) {
      toast.error("Product is out of stock");
      return;
    }

    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items available in stock`);
      return;
    }

    try {
      setAddingToCart(true);
      const res = await axiosInstance({
        ...summaryApi.addToCart,
        data: {
          productId: product._id,
          quantity: quantity
        }
      });

      if (res?.data?.statusCode === 200) {
        toast.success(`${quantity} item${quantity > 1 ? 's' : ''} added to cart!`);
        // Trigger cart count update
        window.dispatchEvent(new Event('cartUpdated'));
        // Optionally navigate to cart or reset quantity
        // navigate('/cart');
      }
    } catch (error) {
      console.error("Failed to add to cart: ", error);
      toast.error(error?.response?.data?.message || "Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product?.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user?.user?._id) {
      toast.error("Please login to add items to wishlist");
      navigate('/login');
      return;
    }

    try {
      setWishlistLoading(true);
      
      if (isInWishlist) {
        // Remove from wishlist
        const res = await axiosInstance({
          ...summaryApi.removeFromWishlist(product._id)
        });

        if (res?.data?.statusCode === 200) {
          setIsInWishlist(false);
          toast.success("Removed from wishlist");
          window.dispatchEvent(new Event('wishlistUpdated'));
        }
      } else {
        // Add to wishlist
        const res = await axiosInstance({
          ...summaryApi.addToWishlist,
          data: {
            productId: product._id
          }
        });

        if (res?.data?.statusCode === 200) {
          setIsInWishlist(true);
          toast.success("Added to wishlist");
          window.dispatchEvent(new Event('wishlistUpdated'));
        }
      }
    } catch (error) {
      console.error("Wishlist operation failed: ", error);
      toast.error(error?.response?.data?.message || "Operation failed");
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='container mx-auto p-4'>
        <div className='flex justify-center items-center min-h-[400px]'>
          <div className='text-xl'>Loading product...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className='container mx-auto p-4'>
        <div className='text-center py-12'>
          <p className='text-gray-500 text-lg'>Product not found.</p>
        </div>
      </div>
    );
  }

  const discountPrice = product.discount > 0 
    ? product.price - (product.price * product.discount / 100)
    : product.price;

  return (
    <div className='container mx-auto p-4 md:p-8'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Product Images */}
        <div className='space-y-4'>
          <div className='aspect-square bg-gray-100 rounded-lg overflow-hidden'>
            <img 
              src={product.images?.[selectedImageIndex]?.url || '/placeholder-image.jpg'} 
              alt={product.name}
              className='w-full h-full object-cover'
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className='grid grid-cols-4 gap-2'>
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img 
                    src={image.url} 
                    alt={`${product.name} ${index + 1}`}
                    className='w-full h-full object-cover'
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className='space-y-6'>
          <div>
            <h1 className='text-3xl font-bold mb-2'>{product.name}</h1>
            {product.category && (
              <p className='text-gray-500 mb-4'>
                Category: {product.category.name}
              </p>
            )}
            
            {/* Rating */}
            {product.averageRating > 0 && (
              <div className='flex items-center gap-2 mb-4'>
                <div className='flex items-center'>
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={i < Math.floor(product.averageRating) ? 'text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className='text-gray-600'>
                  {product.averageRating.toFixed(1)} ({product.numOfReviews} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className='flex items-center gap-4 mb-4'>
              <span className='text-3xl font-bold text-gray-900'>
                ${discountPrice.toFixed(2)}
              </span>
              {product.discount > 0 && (
                <>
                  <span className='text-xl text-gray-500 line-through'>
                    ${product.price.toFixed(2)}
                  </span>
                  <span className='bg-red-500 text-white px-3 py-1 rounded text-sm font-semibold'>
                    {product.discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Stock */}
            <div className='mb-4'>
              {product.stock > 0 ? (
                <p className='text-green-600 font-semibold'>In Stock ({product.stock} available)</p>
              ) : (
                <p className='text-red-600 font-semibold'>Out of Stock</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className='text-xl font-semibold mb-2'>Description</h2>
            <p className='text-gray-700 leading-relaxed'>{product.description}</p>
          </div>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className='flex items-center gap-4'>
              <label className='font-semibold'>Quantity:</label>
              <div className='flex items-center border rounded-lg'>
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className='px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  -
                </button>
                <span className='px-6 py-2 border-x'>{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                  className='px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className='flex gap-4'>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addingToCart}
              className='flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]'
            >
              {addingToCart ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Adding...
                </>
              ) : (
                <>
                  <BsCartPlus className='text-xl' />
                  Add to Cart
                </>
              )}
            </button>
            <button
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
              className={`px-6 py-3 border-2 rounded-lg transition-all ${
                isInWishlist
                  ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100'
                  : 'border-gray-300 hover:bg-gray-50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {wishlistLoading ? (
                <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin inline-block"></span>
              ) : isInWishlist ? (
                <BsHeartFill className='text-xl' />
              ) : (
                <BsHeart className='text-xl' />
              )}
            </button>
          </div>

          {/* Seller Info */}
          {product.seller && (
            <div className='border-t pt-4'>
              <p className='text-gray-600'>
                <span className='font-semibold'>Sold by:</span> {product.seller.store_name || 'Seller'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;

