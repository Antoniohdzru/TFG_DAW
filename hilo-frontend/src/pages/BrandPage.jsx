import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import StatusDisplay from '../components/StatusDisplay';

function BrandPage() {
    const { brandName } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const formattedBrandName = brandName.charAt(0).toUpperCase() + brandName.slice(1);

    useEffect(() => {
        const fetchBrandProducts = async () => {
            setLoading(true);
            setError(null);
            setProducts([]);
            try {
                const response = await fetch(`http://localhost:3000/api/products/brand/${brandName}`);
                if (!response.ok) {
                    throw new Error('El servidor no responde. Inténtalo de nuevo más tarde.');
                }
                const result = await response.json();
                setProducts(result.data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBrandProducts();
    }, [brandName]); 

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Productos de {formattedBrandName}</h1>
            
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
                            <StatusDisplay type="empty" message={`No se encontraron productos para ${formattedBrandName} en la base de datos.`} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default BrandPage;