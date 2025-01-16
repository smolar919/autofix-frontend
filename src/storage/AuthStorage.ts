import { jwtDecode } from "jwt-decode";

const AUTH_TOKEN_STORAGE_KEY = "authorization";
const EXPIRATION_DATE_KEY = "expirationDate";
const ROLE_KEY = "role";

export interface DecodedToken {
    sub: string;
    exp: number;
    role?: string;
}


export const getToken = (): string | null => {
    return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
};


export const setToken = (token: string): void => {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    try {
        const decoded: DecodedToken = jwtDecode(token);
        const expirationMs = decoded.exp * 1000; // decymalizacja exp (sekundy -> ms)
        localStorage.setItem(EXPIRATION_DATE_KEY, expirationMs.toString());
        if (decoded.role) {
            localStorage.setItem(ROLE_KEY, decoded.role);
        }
    } catch (error) {
        console.error("Nie udało się zdekodować tokena", error);
    }
};


export const removeToken = (): void => {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    localStorage.removeItem(EXPIRATION_DATE_KEY);
    localStorage.removeItem(ROLE_KEY);
};

export const getDecodedToken = (): DecodedToken | null => {
    const token = localStorage.getItem("authorization");
    if (token) {
        try {
            const decoded = jwtDecode<DecodedToken>(token);
            return decoded;
        } catch (error) {
            console.error("Error decoding token:", error);
        }
    }
    return null;
};



export const getUserId = (): string | null => {
    const decoded = getDecodedToken();
    return decoded ? decoded.sub : null;
};


export const isTokenExpired = (): boolean => {
    const expirationDate = localStorage.getItem(EXPIRATION_DATE_KEY);
    if (expirationDate) {
        return Date.now() > Number(expirationDate);
    }
    return true;
};
