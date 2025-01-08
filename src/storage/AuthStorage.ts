import {jwtDecode} from "jwt-decode";

const AUTH_TOKEN_STORAGE_KEY = "authorization";

export function getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function setToken(token: string): void {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
}

interface DecodedToken {
    sub: string;
    exp: number;
}

export function getUserId(): string | null {
    const token = getToken();
    if (token) {
        try {
            const decoded = jwtDecode<DecodedToken>(token);
            return decoded.sub;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    } else {
        console.error('Token not found');
        return null;
    }
}