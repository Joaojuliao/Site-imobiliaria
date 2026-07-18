import React from 'react';

/**
 * Skeleton do PropertyCard — exibido durante a carga inicial (sem cache).
 * Tem as mesmas dimensões do card real para evitar layout shift.
 */
const PropertyCardSkeleton = () => (
  <div className="bg-white rounded-xl overflow-hidden border shadow-sm flex flex-col h-full animate-pulse">
    {/* Imagem */}
    <div className="aspect-[4/3] bg-gray-200" />

    {/* Conteúdo */}
    <div className="p-4 flex flex-col flex-1 gap-3">
      {/* Título */}
      <div className="space-y-2">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>

      {/* Features */}
      <div className="flex items-center justify-between py-3 border-t border-b border-gray-100">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-4 bg-gray-200 rounded w-10" />
        ))}
      </div>

      {/* Botão */}
      <div className="mt-auto pt-2">
        <div className="h-10 bg-gray-200 rounded-lg w-full" />
      </div>
    </div>
  </div>
);

/**
 * Grid de skeletons — use no lugar do grid de PropertyCards durante loading.
 */
export const PropertySkeletonGrid = ({ count = 8 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <PropertyCardSkeleton key={i} />
    ))}
  </div>
);

export default PropertyCardSkeleton;