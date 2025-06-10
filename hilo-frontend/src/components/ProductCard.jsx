import React from 'react';

function ProductCard({ product }) {
    // Si la imagen del producto falla, usa una imagen por defecto o un placeholder.
    const handleError = (e) => {
        e.target.src = 'https://via.placeholder.com/250'; 
    };

    return (
        <div className="product-card">
            <a href={product.product_url} target="_blank" rel="noopener noreferrer">
                <img
                    src={product.image_url || 'https://via.placeholder.com/250'}
                    alt={product.name}
                    className="product-card-image"
                    onError={handleError}
                />
                <div className="product-card-info">
                    <h3>{product.name}</h3>
                    <p>{product.price || 'Consultar'}</p>
                </div>
            </a>
        </div>
    );
}

export default ProductCard;