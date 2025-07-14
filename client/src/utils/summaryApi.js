export const baseURL="http://localhost:8080"


//endpoints
const summaryApi = {
    register : {
        url : '/api/user/register',
        method : 'post'
    },
    login :{
        url : '/api/user/login',
        method : 'post'
    },
    forgot_password: {
        url : '/api/user/forgot-password',
        method : 'put'
    },
    otp_verification: {
        url : '/api/user/verify-forgot-password-otp',
        method : 'put'
    },
    reset_password: {
        url : '/api/user/reset-password',
        method : 'put'
    },
    refreshToken: {
        url : '/api/user/refresh-token',
        method : 'post'
    },
    userDetails: {
        url : '/api/user/user-detail',
        method : 'get'
    }
}

export default summaryApi