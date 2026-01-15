import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../utils/api';
import { showSuccess, showError } from '../utils/toast';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getCategories();
    }, []);

    const getCategories = async () => {
        setLoading(true);
        try {
            const result = await apiCall('/categories');
            if(Array.isArray(result)){
                setCategories(result);
            } else {
                setCategories([]);
            }
        } catch (error) {
            console.error("Categories fetch error:", error);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    }

    const deleteCategory = async (id) => {
        if(!window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?')){
            return;
        }
        
        try {
            const result = await apiCall(`/category/${id}`, {
                method: 'delete'
            });
            if(result){
                getCategories();
                showSuccess('Kategori başarıyla silindi!');
            }
        } catch (error) {
            showError(error.message || "Kategori silinemedi!");
        }
    }

    return (
        <div className='product-list'>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
                <h1>🏷️ Kategorilerim</h1>
                <button className='appButton' onClick={() => navigate('/add-category')} style={{width: 'auto', padding: '0.75rem 1.5rem'}}>
                    ➕ Kategori Ekle
                </button>
            </div>
            {loading && (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                </div>
            )}
            {!loading && categories.length > 0 && (
                <ul className='product-ul' style={{gridTemplateColumns: '2fr 3fr 150px'}}>
                    <li><strong>Kategori Adı</strong></li>
                    <li><strong>Açıklama</strong></li>
                    <li><strong>İşlemler</strong></li>
                </ul>
            )}
            {!loading && categories.length > 0 && categories.map((item) => 
                <ul key={item._id} className='product-ul' style={{gridTemplateColumns: '2fr 3fr 150px'}}>
                    <li>{item.name}</li>
                    <li>{item.description || '-'}</li>
                    <li>
                        <button onClick={() => deleteCategory(item._id)}>Sil</button>
                    </li>
                </ul>
            )}
            {!loading && categories.length === 0 && (
                <h1>Henüz kategori eklenmemiş. İlk kategorinizi eklemek için "Kategori Ekle" butonuna tıklayın.</h1>
            )}
        </div>
    )
}

export default CategoryList;
