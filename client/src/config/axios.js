import axios from 'axios'


const axiosInstance = axios.create({
    baseURL: "/api",
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
})


export default axiosInstance;