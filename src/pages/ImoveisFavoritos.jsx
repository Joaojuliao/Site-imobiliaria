import React from 'react';
import { useProperties } from '../context/PropertyContext';
import PropertyCard from '../components/ui/PropertyCard';
import { PropertySkeletonGrid } from '../components/ui/PropertyCardSkeleton';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import useSEO from '../hooks/useSEO';

const ImoveisFavoritos = () => {
    useSEO('Meus Favoritos', 'Confira sua lista de imóveis favoritos salvos na ImobiSheet.');
    const { properties, favorites, loading } = useProperties();

    const favoriteProperties = properties.filter(p => favorites.includes(p.id));

    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Heart className="h-8 w-8 text-red-500 fill-current" />
                            Meus Favoritos
                        </h1>
                        {!loading && (
                            <p className="text-gray-500 mt-2">
                                {favoriteProperties.length}{' '}
                                {favoriteProperties.length === 1 ? 'imóvel salvo' : 'imóveis salvos'}
                            </p>
                        )}
                    </div>
                    <Link to="/imoveis">
                        <Button variant="outline">Ver todos os imóveis</Button>
                    </Link>
                </div>

                {loading ? (
                    // Mostra skeleton apenas se há favoritos salvos (senão seria confuso)
                    favorites.length > 0 ? (
                        <PropertySkeletonGrid count={Math.min(favorites.length, 4)} />
                    ) : null
                ) : favoriteProperties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {favoriteProperties.map(property => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="h-10 w-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Sua lista está vazia</h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-8">
                            Você ainda não favoritou nenhum imóvel. Explore nossas opções e clique no coração para salvar seus favoritos.
                        </p>
                        <Link to="/imoveis">
                            <Button>Começar a explorar</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImoveisFavoritos;