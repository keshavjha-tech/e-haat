import axiosInstance from './axiosInstance'
import summaryApi from './summaryApi'


const fetchUserDeatil = async()=>{
 try {
    const response = axiosInstance({
        ...summaryApi.userDetails
    })
    return response
 } catch (error) {
    console.log(error)
 }
}

export default fetchUserDeatil