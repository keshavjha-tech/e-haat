import axiosInstance from './axiosInstance'
import summaryApi from './summaryApi'


const fetchUserDeatil = async()=>{
 try {
    const response = await axiosInstance({
        ...summaryApi.userDetails
    })
    return response?.data?.data
 } catch (error) {
    console.log(error)
 }
}

export default fetchUserDeatil