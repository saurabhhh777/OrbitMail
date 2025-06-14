import axios from 'axios';


export const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_EXPRESS_URL}` || 'http://localhost:3000/api',
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },

});