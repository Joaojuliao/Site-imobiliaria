import React from 'react';
import Header from './Header';
import Footer from './Footer';
import RevalidatingBadge from '../ui/RevalidatingBadge';
import { useProperties } from '../../context/PropertyContext';

const Layout = ({ children }) => {
    const { revalidating } = useProperties();
    <RevalidatingBadge show={revalidating} />;
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
