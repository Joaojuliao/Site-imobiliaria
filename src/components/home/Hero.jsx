import React from 'react';
import FilterBar from './FilterBar';

const Hero = () => {
    return (
        <section className="relative">
            {/* Background Image */}
            <div className="h-[500px] w-full relative overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                    alt="Luxury Home"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                        Encontre o imóvel dos seus sonhos
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 max-w-2xl drop-shadow-md">
                        Milhares de opções de casas, apartamentos e terrenos para você comprar ou alugar.
                    </p>
                </div>
            </div>

            {/* Filter Bar Container */}
            <div id="search-filter" className="container mx-auto px-4">
                <FilterBar />
            </div>
        </section>
    );
};

export default Hero;
