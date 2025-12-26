import { createBrowserRouter } from 'react-router-dom'
import App from '../App.jsx'
import Home from '../pages/Home.jsx'
import SearchPage from '../pages/SearchPage.jsx'
import RegisterPage from '../features/auth/RegisterPage.jsx'
import LoginPage from '../features/auth/LoginPage.jsx'
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage.jsx'
import OtpVerificationPage from '../features/auth/OtpVerificationPage.jsx'
import ResetPasswordPage from '../features/auth/ResetPasswordPage.jsx'
import UserMenuMobilePage from '../features/user/UserMenuMobilePage.jsx'
import UserDashboard from '../features/user/UserDashboard.jsx'
import UserProfilePage from '../features/user/UserProfilePage.jsx'
import WishlistPage from '../features/user/WishlistPage.jsx'
import ManageAddressesPage from '../features/user/ManageAddressesPage.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import GuestRoute from './GuestRoute.jsx'
import Notification from '../pages/Notification.jsx'
import OrdersPage from '@/features/user/OrdersPage.jsx'
import ProductDetailPage from '../pages/ProductDetailPage.jsx'
import CartPage from '../pages/CartPage.jsx'
import CheckoutPage from '../pages/CheckoutPage.jsx'
import ContactPage from '../pages/ContactPage.jsx'
import SupportPage from '../pages/SupportPage.jsx'
import AboutPage from '../pages/AboutPage.jsx'



const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: '', element: <Home /> },
            { path: "product/:productId", element: <ProductDetailPage /> },
            { path: "cart", element: <CartPage /> },
            { path: "checkout", element: <CheckoutPage /> },
            { path: "contact", element: <ContactPage /> },
            { path: "support", element: <SupportPage /> },
            { path: "about", element: <AboutPage /> },
            { path: "search", element: <SearchPage /> },
            {
                element: <GuestRoute />,
                children: [
                    { path: "register", element: <RegisterPage /> },
                    { path: "login", element: <LoginPage /> },
                    { path: "forgot-password", element: <ForgotPasswordPage /> },
                    { path: "otp-verification", element: <OtpVerificationPage /> },
                    { path: "reset-password", element: <ResetPasswordPage /> },
                ]
            },
            {
                path: "user-menu",
                element: <ProtectedRoute />,
                children: [{ path: '', element: <UserMenuMobilePage /> }]
            },
            {
                path: "orders",
                element: <ProtectedRoute />,
                children: [{ path: '', element: <OrdersPage /> }]
            },

            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: "dashboard",
                        element: <UserDashboard />,
                        children: [
                            { path: "profile", element: <UserProfilePage /> },
                            { path: "wishlist", element: <WishlistPage /> },
                            { path: "addresses", element: <ManageAddressesPage /> },
                            { path: "notifications", element: <Notification /> },
                        ]
                    }
                ]
            }

        ]
    }
])

export default router