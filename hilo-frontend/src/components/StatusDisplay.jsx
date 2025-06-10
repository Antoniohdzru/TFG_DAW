import React from 'react';
import { FaExclamationCircle, FaSearch, FaInfoCircle } from 'react-icons/fa';

// Este objeto nos permite elegir un icono según el tipo de mensaje
const icons = {
    error: <FaExclamationCircle size={40} />,
    empty: <FaSearch size={40} />,
    info: <FaInfoCircle size={40} />,
};

function StatusDisplay({ type, message }) {
    return (
        <div className={`status-display status-${type}`}>
            <div className="status-icon">{icons[type]}</div>
            <p>{message}</p>
        </div>
    );
}

export default StatusDisplay;