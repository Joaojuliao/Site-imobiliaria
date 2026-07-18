import React from 'react';
import FilterBar from '../components/home/FilterBar';
import PropertyCard from '../components/ui/PropertyCard';
import { PropertySkeletonGrid } from '../components/ui/PropertyCardSkeleton';
import RevalidatingBadge from '../components/ui/RevalidatingBadge';
import { useProperties } from '../context/PropertyContext';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import useSEO from '../hooks/useSEO';

const Imoveis = () => {
    useSEO('Todos os Imóveis', 'Explore nossa lista completa de imóveis.');
    const {
        filteredProperties,
        loading,
        revalidating,
        error,
        refresh,
        resetFilters,
        page,
        totalPages,
        total,
        goToPage,
    } = useProperties();

    return (
        <div className="min-h-screen bg-gray-50 pb-16">

            {/* Hero */}
            <section className="relative">
                <div className="h-[320px] w-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/50 z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                        alt="Imóveis"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
                            Nossos Imóveis
                        </h1>
                        <p className="text-lg text-white/90 max-w-xl drop-shadow-md">
                            Utilize os filtros abaixo para refinar sua busca e encontrar o imóvel ideal.
                        </p>
                    </div>
                </div>
                <div className="container mx-auto px-4">
                    <FilterBar />
                </div>
            </section>

            {/* Resultados */}
            <div className="container mx-auto px-4 pt-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">Resultados</h2>
                        {!loading && (
                            <p className="text-gray-500 mt-1">
                                {total} {total === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
                                {totalPages > 1 && ` · página ${page} de ${totalPages}`}
                            </p>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
                        <strong className="font-bold">Erro ao carregar imóveis: </strong>
                        <span>{error}</span>
                        <button onClick={refresh} className="ml-4 underline font-medium hover:no-underline">
                            Tentar novamente
                        </button>
                    </div>
                )}

                {loading ? (
                    <PropertySkeletonGrid count={24} />
                ) : filteredProperties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredProperties.map(property => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed shadow-sm">
                        <div className="bg-gray-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Nenhum imóvel encontrado</h3>
                        <p className="text-gray-500 mt-2">Tente ajustar seus filtros ou buscar por outra cidade.</p>
                        <button
                            onClick={resetFilters}
                            className="mt-6 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90"
                        >
                            Limpar todos os filtros
                        </button>
                    </div>
                )}

                {/* Paginação */}
                {!loading && totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
                        <button
                            disabled={page === 1}
                            onClick={() => goToPage(page - 1)}
                            className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                            .reduce((acc, p, idx, arr) => {
                                if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                                acc.push(p);
                                return acc;
                            }, [])
                            .map((p, idx) =>
                                p === '...' ? (
                                    <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
                                ) : (
                                    <button
                                        key={p}
                                        onClick={() => goToPage(p)}
                                        className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
                                            page === p
                                                ? 'bg-primary text-white shadow-sm'
                                                : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                )
                            )
                        }

                        <button
                            disabled={page === totalPages}
                            onClick={() => goToPage(page + 1)}
                            className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>

            <RevalidatingBadge show={revalidating} />
        </div>
    );
};

export default Imoveis;