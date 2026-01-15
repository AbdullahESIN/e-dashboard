import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall, saveUser } from '../utils/api';
import { showSuccess, showError } from '../utils/toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        const auth = localStorage.getItem('user');
        if(auth){
            navigate('/');
        }
    }, [navigate]);
    
    const handleLogin = async () => {
        if(!email || !password){
            showError("Lütfen email ve şifre giriniz!");
            return;
        }

        setLoading(true);
        try {
            const result = await apiCall('/login', {
                method: 'post',
                body: JSON.stringify({ email, password })
            });

            if(result && result.name && result.token){
                saveUser(result);
                showSuccess(`Hoş geldiniz, ${result.name}!`);
                navigate('/');
            }
            else{
                showError(result?.result || result?.message || "Geçerli bilgileri giriniz");
            }
        } catch (error) {
            console.error("Login error:", error);
            showError(error.message || "Giriş başarısız!");
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className='login'>
            <h1>🔐 Giriş Yap</h1>
            <input type="text" className='inputBox' placeholder='📧 Email adresiniz'
                onChange={(e) => setEmail(e.target.value)} value={email} />
            <input type="password" className='inputBox' placeholder='🔒 Şifreniz'
                onChange={(e) => setPassword(e.target.value)} value={password} />
            <button onClick={handleLogin} className='appButton' type="button" disabled={loading}>
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
        </div>
    )
}
export default Login;