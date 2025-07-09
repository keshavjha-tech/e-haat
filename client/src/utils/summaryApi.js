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
}

export default summaryApi