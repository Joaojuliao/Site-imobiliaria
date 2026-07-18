import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/home/Hero';
import FeaturedSection from '../components/home/FeaturedSection';
import RevalidatingBadge from '../components/ui/RevalidatingBadge';
import { useProperties } from '../context/PropertyContext';
import useSEO from '../hooks/useSEO';

const Home = () => {
    useSEO('Início', 'Encontre o imóvel ideal para você. Casas, apartamentos e terrenos para venda, aluguel e temporada.');
    const { revalidating } = useProperties();

    return (
        <div className="min-h-screen bg-gray-50">
            <Hero />
            <FeaturedSection />

            <section className="py-16 container mx-auto px-4 text-center">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Veja Todos os Nossos Imóveis</h2>
                    <p className="text-gray-600 mb-8">
                        Temos uma ampla variedade de casas, apartamentos e terrenos esperando por você.
                        Explore nossa lista completa com filtros avançados.
                    </p>
                    <Link
                        to="/imoveis"
                        className="inline-block bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
                    >
                        Ver Todos os Imóveis
                    </Link>
                </div>
            </section>

            <RevalidatingBadge show={revalidating} />
        </div>
    );
};

export default Home;