import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Componentes y Páginas
import App from './App.jsx';
import HomePage from './pages/HomePage.jsx';
import ResultsPage from './pages/ResultsPage.jsx';
import AboutUsPage from './pages/AboutUsPage.jsx';
import RandomProductsPage from './pages/RandomProductsPage.jsx';
import BrandPage from './pages/BrandPage.jsx'; 
import './index.css';

// Define las rutas de la aplicación
const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'search',
                element: <ResultsPage />,
            },
            {
                path: 'about',
                element: <AboutUsPage />,
            },
            {
                path: 'trending',
                element: <RandomProductsPage title="Productos en Tendencia" />,
            },
            {
                path: 'no-idea',
                element: <RandomProductsPage title="¿Nada en mente?" />,
            },
            {
                path: 'brand/:brandName',
                element: <BrandPage />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);