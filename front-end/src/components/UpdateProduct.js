import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiCall } from '../utils/api';
import { showSuccess, showError } from '../utils/toast';

const UpdateProduct = () => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [company, setCompany] = useState("");
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getProductDetails();
        getCategories();
    }, []);

    const getCategories = async () => {
        try {
            const result = await apiCall('/categories');
            if(Array.isArray(result)){
                setCategories(result);
            }
        } catch (error) {
            console.error("Categories fetch error:", error);
        }
    }

    const getProductDetails = async () => {
        try {
            const result = await apiCall(`/product/${params.id}`);
            if(result && result.name){
                setName(result.name);
                setPrice(result.price);
                setCategory(result.category);
                setCompany(result.company);
            }
        } catch (error) {
            showError(error.message || "Ürün bilgileri yüklenemedi!");
            navigate('/');
        }
    }

    const updateProduct = async () => {
        if(!name || !price || !category || !company){
            showError("Lütfen tüm alanları doldurun!");
            return;
        }

        setLoading(true);
        try {
            const result = await apiCall(`/product/${params.id}`, {
                method: 'put',
                body: JSON.stringify({name, price, category, company})
            });
            if(result){
                showSuccess("Ürün başarıyla güncellendi!");
                navigate('/');
            }
        } catch (error) {
            showError(error.message || "Ürün güncellenemedi!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='product'>
            <h1>✏️ Ürün Güncelle</h1>
            <input type="text" placeholder='📦 Ürün İsmi' className='inputBox'
                value={name} onChange={(e) => setName(e.target.value)}
            />
            <input type="text" placeholder='💰 Ürün Fiyatı (₺)' className='inputBox'
                value={price} onChange={(e) => setPrice(e.target.value)}
            />
            {categories.length > 0 ? (
                <select className='inputBox' value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">🏷️ Kategori Seçin</option>
                    {categories.map(cat => (
                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                </select>
            ) : (
                <input type="text" placeholder='🏷️ Ürün Kategorisi' className='inputBox'
                value={category} onChange={(e) => setCategory(e.target.value)}
                />
            )}
            <input type="text" placeholder='🏢 Şirket' className='inputBox'
                value={company} onChange={(e) => setCompany(e.target.value)}
            />
            <button className='appButton' onClick={updateProduct} disabled={loading}>
                {loading ? 'Güncelleniyor...' : 'Ürünü Güncelle'}
            </button>
        </div>
    )
}

export default UpdateProduct;
