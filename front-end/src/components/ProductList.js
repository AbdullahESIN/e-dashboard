import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../utils/api';
import { showSuccess, showError } from '../utils/toast';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchKey, setSearchKey] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [priceSort, setPriceSort] = useState("");
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        getProducts(currentPage);
        getCategories();
    }, [currentPage]);

    useEffect(() => {
        applyFilters();
    }, [products, searchKey, categoryFilter, priceSort]);

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

    const applyFilters = () => {
        let filtered = [...products];

        // Arama filtresi
        if(searchKey){
            filtered = filtered.filter(item => 
                item.name.toLowerCase().includes(searchKey.toLowerCase()) ||
                item.company.toLowerCase().includes(searchKey.toLowerCase()) ||
                item.category.toLowerCase().includes(searchKey.toLowerCase())
            );
        }

        // Kategori filtresi
        if(categoryFilter){
            filtered = filtered.filter(item => item.category === categoryFilter);
        }

        // Sıralama
        if(priceSort === 'asc'){
            filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else if(priceSort === 'desc'){
            filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        }

        setFilteredProducts(filtered);
    }

    const getProducts = async (page = 1) => {
        setLoading(true);
        try {
            const result = await apiCall(`/products?page=${page}&limit=10`);
            if(result && result.products){
                setProducts(result.products);
                setCurrentPage(result.page);
                setTotalPages(result.totalPages);
                setTotalProducts(result.total);
            } else if(Array.isArray(result)){
                setProducts(result);
                setTotalPages(1);
                setTotalProducts(result.length);
            } else {
                setProducts([]);
                setTotalPages(1);
                setTotalProducts(0);
            }
        } catch (error) {
            console.error("Products fetch error:", error);
            setProducts([]);
            // Hata mesajını sadece kritik hatalarda göster
            if(error.message && !error.message.includes('Token')){
                showError(error.message || "Ürünler yüklenemedi!");
            }
        } finally {
            setLoading(false);
        }
    }

    const deleteProduct = async (id) => {
        if(!window.confirm('Bu ürünü silmek istediğinize emin misiniz?')){
            return;
        }
        
        try {
            const result = await apiCall(`/product/${id}`, {
                method: 'delete'
            });
            if(result){
                getProducts(currentPage);
                showSuccess('Ürün başarıyla silindi!');
            }
        } catch (error) {
            showError(error.message || "Ürün silinemedi!");
        }
    }

    const searchHandle = (event) => {
        setSearchKey(event.target.value);
    }

    const clearFilters = () => {
        setSearchKey("");
        setCategoryFilter("");
        setPriceSort("");
    }

    return (
        <div className='product-list'>
            <h1>📦 Ürünlerim</h1>
            <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem'}}>
                <input 
                    type="text" 
                    className='search-product-box' 
                    placeholder='🔍 Ürün ara...'
                    value={searchKey}
                    onChange={searchHandle}
                    style={{flex: '1', minWidth: '200px'}}
                />
                {categories.length > 0 && (
                    <select className='inputBox' value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{width: '200px'}}>
                        <option value="">Tüm Kategoriler</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                )}
                <select className='inputBox' value={priceSort} onChange={(e) => setPriceSort(e.target.value)} style={{width: '180px'}}>
                    <option value="">Sıralama</option>
                    <option value="asc">Fiyat: Düşükten Yükseğe</option>
                    <option value="desc">Fiyat: Yüksekten Düşüğe</option>
                </select>
                {(searchKey || categoryFilter || priceSort) && (
                    <button className='appButton' onClick={clearFilters} style={{width: 'auto', padding: '0.75rem 1.5rem', background: 'var(--text-secondary)'}}>
                        Filtreleri Temizle
                    </button>
                )}
            </div>
            {loading && (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                </div>
            )}
            {!loading && filteredProducts.length > 0 && (
                <>
                    <ul className='product-ul'>
                        <li>S. No</li>
                        <li>İsim</li>
                        <li>Fiyat</li>
                        <li>Kategori</li>
                        <li>Şirket</li>
                        <li>İşlemler</li>
                    </ul>
                    {filteredProducts.map((item, index) => 
                        <ul key={item._id} className='product-ul'>
                            <li>{index + 1}</li>
                            <li>{item.name}</li>
                            <li>{item.price} ₺</li>
                            <li>{item.category}</li>
                            <li>{item.company}</li>
                            <li>
                                <button onClick={() => deleteProduct(item._id)}>Sil</button>
                                <button onClick={() => navigate(`/update/${item._id}`)}>Güncelle</button>
                            </li>
                        </ul>
                    )}
                </>
            )}
            {!loading && filteredProducts.length === 0 && products.length > 0 && (
                <h1>Filtre kriterlerinize uygun ürün bulunamadı.</h1>
            )}
            {!loading && products.length === 0 && (
                <h1>Henüz ürün eklenmemiş. İlk ürününüzü eklemek için "Ürün Ekle" sayfasına gidin.</h1>
            )}
            
            {!loading && totalPages > 1 && (
                <div style={{display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem', alignItems: 'center'}}>
                    <button 
                        className='appButton' 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        style={{width: 'auto', padding: '0.5rem 1rem'}}
                    >
                        ← Önceki
                    </button>
                    <span style={{padding: '0 1rem'}}>
                        Sayfa {currentPage} / {totalPages} (Toplam: {totalProducts})
                    </span>
                    <button 
                        className='appButton' 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        style={{width: 'auto', padding: '0.5rem 1rem'}}
                    >
                        Sonraki →
                    </button>
                </div>
            )}
        </div>
    )
}

export default ProductList;
