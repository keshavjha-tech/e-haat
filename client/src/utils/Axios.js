import axios from 'axios'
import { baseURL } from './summaryApi'

const Axios = axios.create({
    baseURL : baseURL,
    withCredentials: true

})

export default Axios