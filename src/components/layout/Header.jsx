import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Menu, X, Heart } from 'lucide-react';
import Button from '../ui/Button';

import { useProperties } from '../../context/PropertyContext';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { filters, updateFilters, favorites } = useProperties();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
        if (!isSearchOpen) {
            // Focus logic could go here if we had a ref
        }
    };

    const handleSearchChange = (e) => {
        updateFilters({ city: e.target.value });
    };

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter') {
            setIsSearchOpen(false);
            if (location.pathname !== '/imoveis') {
                navigate('/imoveis');
            }
        }
    };

    const handleContact = () => {
        const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '';
        const text = "Olá! Gostaria de mais informações sobre os imóveis.";
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {isSearchOpen ? (
                    <div className="flex w-full items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar por cidade..."
                                className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={filters.city || ''}
                                onChange={handleSearchChange}
                                onKeyDown={handleSearchSubmit}
                                autoFocus
                            />
                        </div>
                        <Button variant="ghost" size="icon" onClick={toggleSearch}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                ) : (
                    <>
                        <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl">
                            <Home className="h-6 w-6" />
                            <span>Imobi</span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                            <Link to="/" className="hover:text-primary transition-colors">Início</Link>
                            <Link to="/#destaques" className="hover:text-primary transition-colors">Destaques</Link>
                            <Link to="/imoveis" className="hover:text-primary transition-colors">Imóveis</Link>
                            <Link to="/financie" className="hover:text-primary transition-colors">Financie</Link>
                            <Link to="/negocie" className="hover:text-primary transition-colors">Negocie</Link>
                            <Link to="/favoritos" className="hover:text-primary transition-colors flex items-center gap-1.5 group">
                                <span>Favoritos</span>
                                {favorites.length > 0 && (
                                    <span className="flex items-center justify-center bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full group-hover:bg-red-600 transition-colors">
                                        {favorites.length}
                                    </span>
                                )}
                            </Link>

                        </nav>

                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSearch}>
                                <Search className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
                                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </Button>
                            <Button className="hidden md:inline-flex" onClick={handleContact}>
                                Fale Conosco
                            </Button>
                        </div>
                    </>
                )}
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t bg-white">
                    <div className="container mx-auto px-4 py-4 space-y-4">
                        <nav className="flex flex-col gap-4">
                            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors" onClick={toggleMenu}>
                                Início
                            </Link>
                            <Link to="/#destaques" className="text-sm font-medium hover:text-primary transition-colors" onClick={toggleMenu}>
                                Destaques
                            </Link>
                            <Link to="/imoveis" className="text-sm font-medium hover:text-primary transition-colors" onClick={toggleMenu}>
                                Imóveis
                            </Link>
                            <Link to="/financie" className="text-sm font-medium hover:text-primary transition-colors" onClick={toggleMenu}>
                                Financie
                            </Link>
                            <Link to="/negocie" className="text-sm font-medium hover:text-primary transition-colors" onClick={toggleMenu}>
                                Negocie
                            </Link>
                            <Link to="/favoritos" className="text-sm font-medium hover:text-primary transition-colors flex items-center justify-between" onClick={toggleMenu}>
                                Favoritos
                                {favorites.length > 0 && (
                                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        {favorites.length}
                                    </span>
                                )}
                            </Link>

                        </nav>
                        <div className="pt-4 border-t">
                            <Button className="w-full" onClick={handleContact}>
                                Fale Conosco
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
