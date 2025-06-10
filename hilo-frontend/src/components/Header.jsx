import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo2_hilo.png';
import { FaInstagram, FaTwitter } from 'react-icons/fa';

import centerLogo1 from '../assets/adidasicon.png';
import centerLogo2 from '../assets/zaraicon.webp';
import centerLogo3 from '../assets/iconPB.jpg';

function Header() {
    return (
        <header>
            <div className="top-bar">
                <div className="header-left">
                    <Link to="/">
                        <img src={logo} alt="HILO Logo" className="logo" />
                    </Link>
                </div>

                <div className="header-center">
                    <div className="center-logos">
                        <Link to="/brand/adidas">
                            <img src={centerLogo1} alt="Logo Adidas" />
                        </Link>
                        <Link to="/brand/zara">
                            <img src={centerLogo2} alt="Logo Zara" />
                        </Link>
                        <Link to="/brand/Pull&Bear">
                            <img src={centerLogo3} alt="Logo Pull&Bear" />
                        </Link>
                    </div>
                </div>

                <div className="header-right">
                    <nav className="right-nav">
                        <Link to="/about" className="about-us-link">About Us</Link>
                        <div className="social-icons">
                            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                                <FaInstagram size={22} />
                            </a>
                            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                                <FaTwitter size={22} />
                            </a>
                        </div>
                    </nav>
                </div>
            </div>
            <nav className="brand-bar">
                <Link to="/trending">Productos en Tendencia</Link>
                <Link to="/no-idea">¿Nada en mente?</Link>
            </nav>
        </header>
    );
}

export default Header;