import React from 'react';
import { FaEnvelope, FaInstagram, FaLinkedin } from 'react-icons/fa';


const MemberCard = ({ imgSrc, name, description, email, instagramUrl, linkedinUrl }) => (
    <div className="member-card">
        <img src={imgSrc} alt={`Foto de ${name}`} />
        <h3>{name}</h3>

        <div className="member-email">
            <FaEnvelope />
            <a href={`mailto:${email}`}>{email}</a>
        </div>
        <p>{description}</p>

        <div className="member-socials">
            <a href={instagramUrl} title="Instagram" target="_blank" rel="noopener noreferrer">
                <FaInstagram size={24} />
            </a>
            <a href={linkedinUrl} title="LinkedIn" target="_blank" rel="noopener noreferrer">
                <FaLinkedin size={24} />
            </a>
        </div>
    </div>
);


function AboutUsPage() {
    const teamMembers = [
        {
            name: "Antonio Hernández-Carrillo",
            description: "Desarrollador Full Stack",
            imgSrc: "/src/assets/AntonioHC.png",
            email: "antoniohdezcarrillo@gmail.com",
            instagramUrl: "https://www.instagram.com/antoniohdezcarrillo/",
            linkedinUrl: "https://www.linkedin.com/in/antonio-hern%C3%A1ndez-carrillo-fern%C3%A1ndez-rufete-076aa42a0/"
        },
        {
            name: "Antonio J. Martínez",
            description: "Desarrollador y Diseñador Web ",
            imgSrc: "/src/assets/Antonioj.png",
            email: "anjamaad13@gmail.com",
            instagramUrl: "https://www.instagram.com/antonioj",
            linkedinUrl: "https://www.linkedin.com/in/antonioj"
        },
        {
            name: "Cristhian Sáez",
            description: "Gestión financiera",
            imgSrc: "/src/assets/CristhianS.png",
            email: "saezavila10@gmail.com",
            instagramUrl: "https://www.instagram.com/cristhian",
            linkedinUrl: "https://www.linkedin.com/in/cristhian"
        },
        {
            name: "Pablo Luján",
            description: "Comunity manager y Márketing digital",
            imgSrc: "/src/assets/PabloL.png",
            email: "lujan.13pablo@gmail.com",
            instagramUrl: "https://www.instagram.com/pablo",
            linkedinUrl: "https://www.linkedin.com/in/pablo"
        }
    ];

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Nuestro Equipo</h1>
            <div className="about-us-grid">
                {teamMembers.map((member, index) => (
                    <MemberCard
                        key={index}
                        name={member.name}
                        description={member.description}
                        imgSrc={member.imgSrc}
                        email={member.email}
                        instagramUrl={member.instagramUrl}
                        linkedinUrl={member.linkedinUrl}
                    />
                ))}
            </div>
            <section className="about-us-story">
                <h2>Nuestra Historia</h2>
                <h3>¿Quiénes Somos?</h3>
                <p>
                    Somos un grupo de estudiantes graduados del instituto MEDAC GRANADA apasionados por la tecnología y el desarrollo de software. HILO nació como nuestro proyecto final de carrera, un lugar donde pudimos combinar nuestras habilidades técnicas con un interés común: simplificar y mejorar la experiencia de compra online. Creemos en crear herramientas útiles, limpias y eficientes que resuelvan problemas reales.
                </p>
                <h3>¿Por Qué HILO?</h3>
                <p>
                    La idea surgió de una frustración compartida. Todos nos habíamos encontrado con el mismo problema: tener innumerables pestañas abiertas para comparar prendas de nuestras tiendas favoritas. ¿Y si existiera un solo lugar para buscarlas todas? Así nació HILO. Nuestro objetivo es ofrecer un buscador de moda centralizado, rápido e inteligente que te ahorre tiempo y te ayude a encontrar exactamente lo que buscas sin el caos de navegar por múltiples sitios web.
                </p>
            </section>
        </div>

    );
}

export default AboutUsPage;