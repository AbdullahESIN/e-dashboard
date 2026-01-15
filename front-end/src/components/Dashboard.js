import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../utils/api';
import { showError } from '../utils/toast';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalCategories: 0,
        categories: [],
        recentProducts: []
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const [productsResult, categories] = await Promise.all([
                apiCall('/products?page=1&limit=100'),
                apiCall('/categories')
            ]);

            const productList = productsResult?.products || (Array.isArray(productsResult) ? productsResult : []);
            const categoryList = Array.isArray(categories) ? categories : [];

            // Kategori dağılımı
            const categoryDistribution = {};
            productList.forEach(product => {
                categoryDistribution[product.category] = (categoryDistribution[product.category] || 0) + 1;
            });

            setStats({
                totalProducts: productList.length,
                totalCategories: categoryList.length,
                categories: Object.entries(categoryDistribution).map(([name, count]) => ({ name, count })),
                recentProducts: productList.slice(-5).reverse()
            });
        } catch (error) {
            console.error("Dashboard data error:", error);
            showError("Dashboard verileri yüklenemedi!");
        } finally {
            setLoading(false);
        }
    }

    if(loading){
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className='product-list'>
            <h1>📊 Dashboard</h1>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem'}}>
                <div style={{background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-lg)'}}>
                    <h2 style={{margin: '0 0 0.5rem 0', color: 'var(--text-secondary)', fontSize: '0.875rem'}}>Toplam Ürün</h2>
                    <p style={{margin: 0, fontSize: '2.5rem', fontWeight: '700', color: 'var(--primary-color)'}}>{stats.totalProducts}</p>
                </div>
                <div style={{background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-lg)'}}>
                    <h2 style={{margin: '0 0 0.5rem 0', color: 'var(--text-secondary)', fontSize: '0.875rem'}}>Toplam Kategori</h2>
                    <p style={{margin: 0, fontSize: '2.5rem', fontWeight: '700', color: 'var(--secondary-color)'}}>{stats.totalCategories}</p>
                </div>
            </div>

            {stats.categories.length > 0 && (
                <div style={{background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-lg)', marginBottom: '2rem'}}>
                    <h2 style={{marginTop: 0}}>Kategori Dağılımı</h2>
                    {stats.categories.map((cat, index) => (
                        <div key={index} style={{marginBottom: '1rem'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                                <span>{cat.name}</span>
                                <span style={{fontWeight: '600'}}>{cat.count} ürün</span>
                            </div>
                            <div style={{background: 'var(--bg-color)', height: '8px', borderRadius: '4px', overflow: 'hidden'}}>
                                <div style={{
                                    background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
                                    height: '100%',
                                    width: `${(cat.count / stats.totalProducts) * 100}%`,
                                    transition: 'width 0.3s ease'
                                }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {stats.recentProducts.length > 0 && (
                <div style={{background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-lg)'}}>
                    <h2 style={{marginTop: 0}}>Son Eklenen Ürünler</h2>
                    <ul className='product-ul' style={{margin: 0}}>
                        <li>S. No</li>
                        <li>İsim</li>
                        <li>Fiyat</li>
                        <li>Kategori</li>
                        <li>İşlemler</li>
                    </ul>
                    {stats.recentProducts.map((item, index) => 
                        <ul key={item._id} className='product-ul' style={{margin: '0.5rem 0'}}>
                            <li>{index + 1}</li>
                            <li>{item.name}</li>
                            <li>{item.price} ₺</li>
                            <li>{item.category}</li>
                            <li>
                                <button onClick={() => navigate(`/update/${item._id}`)}>Güncelle</button>
                            </li>
                        </ul>
                    )}
                </div>
            )}
        </div>
    )
}

export default Dashboard;
