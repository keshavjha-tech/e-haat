import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BsCartPlus, BsHeart, BsHeartFill } from 'react-icons/bs'
import axiosInstance from '@/api/axiosInstance'
import summaryApi from '@/api/summaryApi'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { useWishlistStatus } from '@/hooks/useWishlistStatus'

function ProductCard({ product }) {
    const [addingToCart, setAddingToCart] = useState(false)
    const [wishlistLoading, setWishlistLoading] = useState(false)
    const navigate = useNavigate()
    const user = useSelector((state) => state?.user)
    const { isInWishlist } = useWishlistStatus(product?._id)

    if (!product) {
        return null; 
    }

    const discountPrice = product.discount > 0 
        ? product.price - (product.price * product.discount / 100)
        : product.price

    const handleQuickAddToCart = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (!user?.user?._id) {
            toast.error("Please login to add items to cart")
            navigate('/login')
            return
        }

        if (product.stock === 0) {
            toast.error("Product is out of stock")
            return
        }

        try {
            setAddingToCart(true)
            const res = await axiosInstance({
                ...summaryApi.addToCart,
                data: {
                    productId: product._id,
                    quantity: 1
                }
            })

            if (res?.data?.statusCode === 200) {
                toast.success("Added to cart!")
                // Trigger cart count update
                window.dispatchEvent(new Event('cartUpdated'));
            }
        } catch (error) {
            console.error("Failed to add to cart: ", error)
            toast.error(error?.response?.data?.message || "Failed to add to cart")
        } finally {
            setAddingToCart(false)
        }
    }

    const handleWishlistToggle = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (!user?.user?._id) {
            toast.error("Please login to add items to wishlist")
            navigate('/login')
            return
        }

        try {
            setWishlistLoading(true)
            
            if (isInWishlist) {
                const res = await axiosInstance({
                    ...summaryApi.removeFromWishlist(product._id)
                })

                if (res?.data?.statusCode === 200) {
                    toast.success("Removed from wishlist")
                    window.dispatchEvent(new Event('wishlistUpdated'))
                }
            } else {
                const res = await axiosInstance({
                    ...summaryApi.addToWishlist,
                    data: {
                        productId: product._id
                    }
                })

                if (res?.data?.statusCode === 200) {
                    toast.success("Added to wishlist")
                    window.dispatchEvent(new Event('wishlistUpdated'))
                }
            }
        } catch (error) {
            console.error("Wishlist operation failed: ", error)
            toast.error(error?.response?.data?.message || "Operation failed")
        } finally {
            setWishlistLoading(false)
        }
    }

    return (
        <div className="relative h-full">
            <Link to={`/product/${product._id}`} className="block h-full">
                <div className="border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 cursor-pointer bg-white h-full flex flex-col group">
                    <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
                        <img 
                            src={product.images?.[0]?.url || '/placeholder-image.jpg'} 
                            alt={product.name} 
                            className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                        />
                        {product.discount > 0 && (
                            <span className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-md text-xs sm:text-sm font-bold shadow-lg">
                                {product.discount}% OFF
                            </span>
                        )}
                        {/* Wishlist Button */}
                        {user?.user?._id && (
                            <button
                                onClick={handleWishlistToggle}
                                disabled={wishlistLoading}
                                className={`absolute top-2 right-2 p-2 rounded-full shadow-lg transition-all z-10 ${
                                    isInWishlist
                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                        : 'bg-white/90 text-gray-600 hover:bg-white'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                            >
                                {wishlistLoading ? (
                                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block"></span>
                                ) : isInWishlist ? (
                                    <BsHeartFill className='text-sm sm:text-base' />
                                ) : (
                                    <BsHeart className='text-sm sm:text-base' />
                                )}
                            </button>
                        )}
                        {/* Quick Add to Cart Button - appears on hover */}
                        {product.stock > 0 && user?.user?._id && (
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <button
                                    onClick={handleQuickAddToCart}
                                    disabled={addingToCart}
                                    className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {addingToCart ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></span>
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <BsCartPlus className="text-lg" />
                                            Quick Add
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                <div className="p-3 sm:p-4 flex-1 flex flex-col">
                    <h2 className="font-semibold text-sm sm:text-base truncate text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                        {product.name}
                    </h2>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <p className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                            ${discountPrice.toFixed(2)}
                        </p>
                        {product.discount > 0 && (
                            <p className="text-xs sm:text-sm text-gray-500 line-through">
                                ${product.price.toFixed(2)}
                            </p>
                        )}
                    </div>
                    {product.averageRating > 0 && (
                        <div className="flex items-center gap-1 mt-auto">
                            <span className="text-yellow-400 text-sm sm:text-base">★</span>
                            <span className="text-xs sm:text-sm text-gray-700 font-medium">
                                {product.averageRating.toFixed(1)}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-500">
                                ({product.numOfReviews})
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    </div>
    )
}

export default ProductCard