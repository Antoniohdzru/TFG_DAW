import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoCentral from '../assets/Logo_bueno_hilo.png';
import ideaImage1 from '../assets/tienda-de-ropa-tienda-de-ropa-en-perchas-en-la-tienda-boutique-moderna.jpg';
import ideaImage2 from '../assets/encendido-computadora-portatil-gris.jpg';


function HomePage() {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (query.trim() !== '') {
            navigate(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <>
            <div className="hero">
                <img src={logoCentral} alt="HILO Logo Grande" className="logo-central" />
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="¿Listo para encontrar el mejor precio?"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button onClick={handleSearch}>🔍</button>
                </div>
            </div>

            <section className="how-it-works-section">
                <div className="info-block image-right">
                    <div className="info-text">
                        <h2>Nuestra Idea: Tu Estilo, Centralizado</h2>
                        <p>
                            Cansados de saltar entre decenas de pestañas para encontrar la prenda perfecta, decidimos crear HILO. 
                            Nuestra misión es simple: unificar la búsqueda de moda en un solo lugar. En lugar de visitar Zara, Pull&Bear, Nike y Adidas por separado, 
                            simplemente escribe lo que buscas aquí. Nosotros nos encargamos del resto.
                        </p>
                    </div>
                    <div className="info-image">
                        <img src={ideaImage1} alt="Collage de ideas de moda" />
                    </div>
                </div>

                <div className="info-block image-left">
                    <div className="info-text">
                        <h2>¿Cómo Funciona?</h2>
                        <p>
                            Usar HILO es fácil. Escribe lo que buscas, como "camiseta blanca" o "zapatillas negras".
                            Primero, consultaremos nuestra base de datos para darte resultados al instante. Si es una búsqueda nueva, nuestros 
                            asistentes digitales visitarán las tiendas por ti en tiempo real, recopilando los mejores productos.
                            ¡Esos resultados se guardan para que la próxima vez la búsqueda sea aún más rápida!
                        </p>
                    </div>
                    <div className="info-image">
                        <img src={ideaImage2} alt="Diagrama del funcionamiento del buscador" />
                    </div>
                </div>
            </section>
        </>
    );
}

export default HomePage;