import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import StatusDisplay from '../components/StatusDisplay'; 

function ResultsPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [source, setSource] = useState('');

    useEffect(() => {
        if (!query) {
            setLoading(false);
            setError('No se ha proporcionado un término de búsqueda.');
            return;
        }
        const fetchResults = async () => {
            setLoading(true);
            setError(null);
            setSource('');
            setResults([]);
            try {
                const response = await fetch(`http://localhost:3000/search?q=${encodeURIComponent(query)}`);
                if (!response.ok) { throw new Error(`El servidor no responde. Inténtalo de nuevo más tarde.`); }
                const data = await response.json();
                setResults(data.data || []);
                setSource(data.source === 'database' ? '' : '');
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [query]);

    return (
        <div>
            <h1 style={{textAlign: 'center'}}>Resultados para: "{query}"</h1>
            
            <div className="results-container">
                {loading && <div className="loader"></div>}
                
                {!loading && source && <StatusDisplay type="info" message={`Resultados obtenidos de: ${source}`} />}
                
                {error && <StatusDisplay type="error" message={error} />}

                {!loading && !error && (
                    <div className="results-grid">
                        {results.length > 0 ? (
                            results.map((product, index) => (
                                <ProductCard key={product.product_url || index} product={product} />
                            ))
                        ) : ( 
                            <StatusDisplay type="empty" message="No se encontraron productos que coincidan con tu búsqueda." />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ResultsPage;