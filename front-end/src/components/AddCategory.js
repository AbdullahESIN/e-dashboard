import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../utils/api';
import { showSuccess, showError } from '../utils/toast';

const AddCategory = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const addCategory = async () => {
        if(!name){
            showError("Kategori adı zorunludur!");
            return;
        }

        setLoading(true);
        try {
            const result = await apiCall('/add-category', {
                method: 'post',
                body: JSON.stringify({name, description})
            });
            
            if(result){
                showSuccess("Kategori başarıyla eklendi!");
                setName("");
                setDescription("");
                navigate('/categories');
            }
        } catch (error) {
            showError(error.message || "Kategori eklenemedi!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='product'>
            <h1>➕ Kategori Ekle</h1>
            <input type="text" placeholder='🏷️ Kategori Adı' className='inputBox'
            value={name} onChange={(e) => setName(e.target.value)}
            />
            <input type="text" placeholder='📝 Açıklama (Opsiyonel)' className='inputBox'
            value={description} onChange={(e) => setDescription(e.target.value)}
            />
            <button className='appButton' onClick={addCategory} disabled={loading}>
                {loading ? 'Ekleniyor...' : 'Kategori Ekle'}
            </button>
            <button className='appButton' onClick={() => navigate('/categories')} disabled={loading} style={{background: 'var(--text-secondary)', marginTop: '0.5rem'}}>
                İptal
            </button>
        </div>
    )
}

export default AddCategory;
