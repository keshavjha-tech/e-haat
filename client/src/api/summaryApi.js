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
    }
}

export default summaryApi