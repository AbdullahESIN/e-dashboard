// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Token'ı localStorage'dan al
const getToken = () => {
    const user = localStorage.getItem('user');
    if (user) {
        try {
            const userData = JSON.parse(user);
            return userData.token;
        } catch (error) {
            return null;
        }
    }
    return null;
};

// API çağrısı yap (token otomatik eklenir)
export const apiCall = async (endpoint, options = {}) => {
    const token = getToken();
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    // Token varsa header'a ekle
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();
        
        // Token süresi dolmuşsa
        if (response.status === 401 && data.error === 'Token süresi dolmuş') {
            localStorage.removeItem('user');
            window.location.href = '/login';
            return;
        }

        if (!response.ok) {
            throw new Error(data.message || data.error || data.result || 'Bir hata oluştu');
        }

        return data;
    } catch (error) {
        throw error;
    }
};

// Kullanıcı bilgilerini localStorage'a kaydet
export const saveUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
};

// Kullanıcı bilgilerini localStorage'dan al
export const getUser = () => {
    const user = localStorage.getItem('user');
    if (user) {
        try {
            return JSON.parse(user);
        } catch (error) {
            return null;
        }
    }
    return null;
};

// Kullanıcıyı çıkış yap
export const logout = () => {
    localStorage.removeItem('user');
};
