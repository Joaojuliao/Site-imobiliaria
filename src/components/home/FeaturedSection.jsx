import React from 'react';
import { useProperties } from '../../context/PropertyContext';
import PropertyCard from '../ui/PropertyCard';
import { PropertySkeletonGrid } from '../ui/PropertyCardSkeleton';

const FeaturedSection = () => {
    const { properties, loading } = useProperties();

    const featuredProperties = properties.filter(p => p.featured).slice(0, 4);

    if (loading) {
        return (
            <section id="destaques" className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="mb-8">
                        <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-2" />
                        <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <PropertySkeletonGrid count={4} />
                </div>
            </section>
        );
    }

    if (featuredProperties.length === 0) return null;

    return (
        <section id="destaques" className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Destaques</h2>
                        <p className="text-gray-500 mt-2">Imóveis selecionados especialmente para você</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredProperties.map(property => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedSection;