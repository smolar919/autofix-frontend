import axios from "axios";
import {getToken} from "./storage/AuthStorage.ts";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error("Błąd w interceptorze żądania:", error);
        return Promise.reject(error);
    }
);


// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401 || error.response?.status === 403) {
//       console.warn("Sesja wygasła lub token jest nieprawidłowy. Wylogowanie...");
//       removeToken();
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

export { axiosInstance };
