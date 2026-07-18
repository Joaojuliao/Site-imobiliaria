import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useSheetCache } from '../hooks/useSheetCache';

const PropertyContext = createContext(null);

const DEFAULT_FILTERS = {
  city: '',
  category: '',
  type: '',
  maxPrice: '',
  bedrooms: '',
};

export function PropertyProvider({ children }) {
  const {
    properties,
    loading,
    revalidating,
    error,
    page,
    totalPages,
    total,
    goToPage,
    refresh,
  } = useSheetCache();

  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('imobisheet_favorites') || '[]'); }
    catch { return []; }
  });

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const toggleFavorite = useCallback((id) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      try { localStorage.setItem('imobisheet_favorites', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const updateFilters = useCallback((partial) => {
    setFilters(prev => ({ ...prev, ...partial }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // Filtros aplicados nos itens da página atual
  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      if (filters.city && !p.city.toLowerCase().includes(filters.city.toLowerCase()) &&
          !p.neighborhood.toLowerCase().includes(filters.city.toLowerCase())) return false;
      if (filters.category && p.category !== filters.category) return false;
      if (filters.type && p.type !== filters.type) return false;
      if (filters.maxPrice && p.price > Number(filters.maxPrice)) return false;
      if (filters.bedrooms && p.bedrooms < Number(filters.bedrooms)) return false;
      return true;
    });
  }, [properties, filters]);

  const value = useMemo(() => ({
    properties,
    filteredProperties,
    loading,
    revalidating,
    error,
    refresh,
    page,
    totalPages,
    total,
    goToPage,
    favorites,
    toggleFavorite,
    filters,
    updateFilters,
    resetFilters,
  }), [
    properties, filteredProperties, loading, revalidating, error, refresh,
    page, totalPages, total, goToPage,
    favorites, toggleFavorite, filters, updateFilters, resetFilters,
  ]);

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperties() {
  const ctx = useContext(PropertyContext);
  if (!ctx) throw new Error('useProperties deve ser usado dentro de PropertyProvider');
  return ctx;
}