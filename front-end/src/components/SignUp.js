import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import { apiCall, saveUser } from '../utils/api';
import { showSuccess, showError } from '../utils/toast';

const SignUp=()=> {
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    useEffect(()=>{
        const auth = localStorage.getItem('user');
        if(auth){
            navigate('/');
        }
    },[navigate])
    
    const collectData =async ()=>{
        // Validation
        if(!name || !email || !password){
            showError("Lütfen tüm alanları doldurun!");
            return;
        }
        if(password.length < 6){
            showError("Şifre en az 6 karakter olmalıdır!");
            return;
        }
        if(!email.includes('@')){
            showError("Geçerli bir email adresi giriniz!");
            return;
        }

        setLoading(true);
        try {
            const result = await apiCall('/register', {
                method: 'post',
                body: JSON.stringify({name,email,password})
            });
            
            if(result.name && result.token){
                saveUser(result);
                showSuccess(`Kayıt başarılı! Hoş geldiniz, ${result.name}!`);
                navigate('/');
            }
            else{
                showError(result.error + ": " + (result.message || ""));
            }
        } catch (error) {
            showError(error.message || "Kayıt başarısız!");
        } finally {
            setLoading(false);
        }
    }
    return(
        <div className = "register">  
            <h1>
                ✨ Kayıt Ol
            </h1> 
            <input className ="inputBox" type="text" placeholder="👤 Adınız"
            value={name} onChange={(e)=>setName(e.target.value)}
            />
            <input className ="inputBox" type="text" placeholder="📧 Email adresiniz"
            value={email} onChange={(e)=>setEmail(e.target.value)}
            />
            <input className ="inputBox" type="password" placeholder="🔒 Şifreniz (min. 6 karakter)"
            value={password} onChange={(e)=>setPassword(e.target.value)}
            />
            <button onClick={collectData} className ="appButton" type = "button" disabled={loading}>
                {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
            </button>
        </div>
    )
}

export default SignUp
