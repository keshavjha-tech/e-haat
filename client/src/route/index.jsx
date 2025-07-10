import { createBrowserRouter } from 'react-router-dom'
import App from '../App.jsx'
import Home from '../pages/Home.jsx'
import SearchPage from '../pages/SearchPage.jsx'
import RegisterPage from '../pages/RegisterPage.jsx'
import LoginPage from '../pages/LoginPage.jsx'
import ForgotPasswordPage from '../pages/ForgotPasswordPage.jsx'
import OtpVerificationPage from '../pages/OtpVerificationPage.jsx'

const router = createBrowserRouter([
    {
        path : "/",
        element : <App />,
        children : [
            { path : '', element : <Home />},
            { path : "search", element : <SearchPage /> },
            { path : "login", element : <LoginPage /> },
            { path : "register", element : <RegisterPage /> },
            { path : "forgot-password", element : <ForgotPasswordPage /> },
            { path : "forgot-password", element : <ForgotPasswordPage /> },
            { path : "otp-verification", element : <OtpVerificationPage /> },
        ]
    }
])

export default router