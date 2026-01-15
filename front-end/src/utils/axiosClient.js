import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Axios instance oluştur
const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - Token ekle
axiosClient.interceptors.request.use(
    (config) => {
        const user = localStorage.getItem('user');
        if (user) {
            try {
                const userData = JSON.parse(user);
                if (userData.token) {
                    config.headers.Authorization = `Bearer ${userData.token}`;
                }
            } catch (error) {
                console.error('Token parse error:', error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Hata yönetimi
axiosClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.response) {
            // Token süresi dolmuşsa
            if (error.response.status === 401 && error.response.data.error === 'Token süresi dolmuş') {
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(new Error('Token süresi dolmuş'));
            }
            
            // Diğer hatalar
            const errorMessage = error.response.data?.message || 
                                error.response.data?.error || 
                                error.response.data?.result || 
                                'Bir hata oluştu';
            return Promise.reject(new Error(errorMessage));
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
