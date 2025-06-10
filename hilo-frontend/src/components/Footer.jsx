import React from 'react';
import instagramLogo from '../assets/instagram.png';
import xLogo from '../assets/x.png';

function Footer() {
    return (
        <footer>
            <div className="footer-content">
                <p>Redes Sociales:
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                        <img src={instagramLogo} alt="Instagram" />
                    </a>
                    <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                        <img src={xLogo} alt="Twitter" />
                    </a>
                </p>
                <p>Contacto: 603 58 29 70</p>
                <p>Email: <a href="mailto:contacto@hilo.com">contacto@hilo.com</a></p>
            </div>
        </footer>
    );
}

export default Footer;