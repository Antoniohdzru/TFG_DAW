import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import StatusDisplay from '../components/StatusDisplay';

function RandomProductsPage({ title }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRandomProducts = async () => {
            setLoading(true);
            setError(null);
            setProducts([]);
            try {
                const response = await fetch('http://localhost:3000/api/products/random?limit=8');
                
                if (!response.ok) { throw new Error('El servidor no responde. Inténtalo de nuevo más tarde.'); }
                const result = await response.json();
                setProducts(result.data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRandomProducts();
    }, [title]); 

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>{title}</h1>
            
            <div className="results-container">
                {loading && <div className="loader"></div>}
                
                {error && <StatusDisplay type="error" message={error} />}

                {!loading && !error && (
                    <div className="results-grid">
                        {products.length > 0 ? (
                            products.map((product, index) => (
                                <ProductCard key={product.product_url || index} product={product} />
                            ))
                        ) : (
                            <StatusDisplay type="empty" message="Aún no hay productos en la base de datos para mostrar." />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default RandomProductsPage;