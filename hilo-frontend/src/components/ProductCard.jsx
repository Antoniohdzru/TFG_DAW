import React from 'react';

function ProductCard({ product }) {
    const handleError = (e) => {
        e.target.onerror = null; 
        e.target.src = 'https://via.placeholder.com/250x250.png?text=Imagen+no+disponible';
    };

    return (
        <div className="product-card">
            <a href={product.product_url} target="_blank" rel="noopener noreferrer">
                <div className="product-image-container">
                    <img
                        src={product.image_url || 'https://via.placeholder.com/250x250.png?text=Imagen+no+disponible'}
                        alt={product.name}
                        className="product-card-image"
                        onError={handleError}
                        loading="lazy"
                    />
                </div>
                
                <div className="product-card-info">
                    <h3>{product.name}</h3>
                    <p>{product.price || 'Consultar'}</p>
                </div>
            </a>
        </div>
    );
}

export default ProductCard;