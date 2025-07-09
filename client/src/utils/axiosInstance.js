import axios from 'axios'
import { baseURL } from './summaryApi'

const axiosInstance = axios.create({
    baseURL : baseURL,
    withCredentials: true

})

export default axiosInstance