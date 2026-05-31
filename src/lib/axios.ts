import axios from 'axios';
import { SESSION_KEY } from '@auth/constants/auth.constants';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: import.meta.env.VITE_API_TIMEOUT
});

api.interceptors.request.use((config) => {
    const session = localStorage.getItem(SESSION_KEY);

    if (session) {
        config.headers.Authorization = `Bearer ${session}`;
    }

    return config;
});

api.interceptors.response.use(undefined, (err) => {
    if (axios.isAxiosError(err) && err.response) {
        console.error('The server responded with a status:', err.response.status);
    }

    return Promise.reject(err);
});

export default api;
