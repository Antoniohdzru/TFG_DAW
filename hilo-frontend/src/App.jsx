import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
        <>
            <Header />
            {isHomePage ? (
                <Outlet />
            ) : (
                <div className="content-wrapper">
                    <Outlet />
                </div>
            )}
            <Footer />
        </>
    );
}

export default App;