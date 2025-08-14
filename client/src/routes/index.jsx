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



const router = createBrowserRouter([
    {
        path : "/",
        element : <App />,
        children : [
            { path : '', element : <Home />},
            { path : "register", element : <RegisterPage /> },
            { path : "login", element : <LoginPage />},
            { path : "search", element : <SearchPage /> },
            { path : "forgot-password", element : <ForgotPasswordPage /> },
            { path : "forgot-password", element : <ForgotPasswordPage /> },
            { path : "otp-verification", element : <OtpVerificationPage /> },
            { path : "reset-password", element : <ResetPasswordPage /> },
            { path : "user-menu", element : <UserMenuMobilePage /> },
            { 
                path : "dashboard",
                element: <UserDashboard />,
                children: [
                    {path : "profile", element : <UserProfilePage /> },
                    {path : "wishlist", element : <WishlistPage /> },
                    {path : "notifications"},
                ]
            }
        ]
    }
])

export default router