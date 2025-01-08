import axios from 'axios'
import {getToken} from "./storage/AuthStorage";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080'
});

axiosInstance.interceptors.request.use(
    config => {
        const token = getToken()
        if(token){
            config.headers['Authorization'] = `Bearer ${getToken()}`;
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        return Promise.reject(error);
    }
);


export {axiosInstance};