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
            instagramUrl: "https://www.instagram.com/antonio",
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
            description: "Gestión finianciera",
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
        </div>
    );
}

export default AboutUsPage;