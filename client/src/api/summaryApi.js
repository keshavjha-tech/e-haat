import { logout } from "../store/userSlice"

export const baseURL="http://localhost:8080"


//endpoints
const summaryApi = {
    register : {
        url : '/api/v1/user/register',
        method : 'post'
    },
    login :{
        url : '/api/v1/user/login',
        method : 'post'
    },
    forgot_password: {
        url : '/api/v1/user/forgot-password',
        method : 'put'
    },
    otp_verification: {
        url : '/api/v1/user/verify-forgot-password-otp',
        method : 'put'
    },
    reset_password: {
        url : '/api/v1/user/reset-password',
        method : 'put'
    },
    refreshToken: {
        url : '/api/v1/user/refresh-token',
        method : 'post'
    },
    userDetails: {
        url : '/api/v1/user/user-detail',
        method : 'get'
    },
    logout: {
        url : '/api/v1/user/logout',
        method: 'get'
    },
    update: {
        url: '/api/v1/user/update-user',
        method: 'put'
    },
    // Product endpoints
    products: {
        url: '/api/v1/products',
        method: 'get'
    },
    productById: (productId) => ({
        url: `/api/v1/products/${productId}`,
        method: 'get'
    }),
    // Cart endpoints
    addToCart: {
        url: '/api/v1/cart/add',
        method: 'post'
    },
    getCart: {
        url: '/api/v1/cart',
        method: 'get'
    },
    updateCartItem: {
        url: '/api/v1/cart/update-quantity',
        method: 'put'
    },
    removeFromCart: (productId) => ({
        url: `/api/v1/cart/remove/${productId}`,
        method: 'delete'
    }),
    clearCart: {
        url: '/api/v1/cart/clear',
        method: 'delete'
    },
    // Category endpoints
    categories: {
        url: '/api/v1/category',
        method: 'get'
    },
    categoryById: (slugOrId) => ({
        url: `/api/v1/category/${slugOrId}`,
        method: 'get'
    }),
    // Wishlist endpoints
    getWishlist: {
        url: '/api/v1/wishlist',
        method: 'get'
    },
    addToWishlist: {
        url: '/api/v1/wishlist/add',
        method: 'post'
    },
    removeFromWishlist: (productId) => ({
        url: `/api/v1/wishlist/remove/${productId}`,
        method: 'delete'
    }),
    checkWishlistStatus: (productId) => ({
        url: `/api/v1/wishlist/check/${productId}`,
        method: 'get'
    }),
    // Address endpoints
    getAddresses: {
        url: '/api/v1/address',
        method: 'get'
    },
    addAddress: {
        url: '/api/v1/address',
        method: 'post'
    },
    updateAddress: (addressId) => ({
        url: `/api/v1/address/${addressId}`,
        method: 'put'
    }),
    deleteAddress: (addressId) => ({
        url: `/api/v1/address/${addressId}`,
        method: 'delete'
    }),
    // Payment endpoints
    createRazorpayOrder: {
        url: '/api/v1/payment/create-order',
        method: 'post'
    },
    verifyPayment: {
        url: '/api/v1/payment/verify',
        method: 'post'
    },
    getPaymentStatus: (orderId) => ({
        url: `/api/v1/payment/status/${orderId}`,
        method: 'get'
    }),
}
export default summaryApi