import React, { createContext, useState, useContext } from 'react';
import { apiCall } from '../utils/api';

const ProductContext = createContext();

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts must be used within ProductProvider');
    }
    return context;
};

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const result = await apiCall('/products');
            if(Array.isArray(result)){
                setProducts(result);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error("Products fetch error:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const addProduct = async (productData) => {
        try {
            const result = await apiCall('/add-product', {
                method: 'post',
                body: JSON.stringify(productData)
            });
            if(result){
                await fetchProducts();
                return result;
            }
        } catch (error) {
            throw error;
        }
    };

    const updateProduct = async (id, productData) => {
        try {
            const result = await apiCall(`/product/${id}`, {
                method: 'put',
                body: JSON.stringify(productData)
            });
            if(result){
                await fetchProducts();
                return result;
            }
        } catch (error) {
            throw error;
        }
    };

    const deleteProduct = async (id) => {
        try {
            const result = await apiCall(`/product/${id}`, {
                method: 'delete'
            });
            if(result){
                await fetchProducts();
                return result;
            }
        } catch (error) {
            throw error;
        }
    };

    return (
        <ProductContext.Provider value={{ 
            products, 
            loading, 
            fetchProducts, 
            addProduct, 
            updateProduct, 
            deleteProduct 
        }}>
            {children}
        </ProductContext.Provider>
    );
};
