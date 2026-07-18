import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import Button from '../ui/Button';
import { useProperties } from '../../context/PropertyContext';

const FilterBar = () => {
    const { filters, updateFilters } = useProperties();
    const navigate = useNavigate();
    const location = useLocation();

    const handleChange = (e) => {
        const { name, value } = e.target;
        updateFilters({ [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (location.pathname !== '/imoveis') {
            navigate('/imoveis');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-lg border -mt-8 relative z-20 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            <div className="md:col-span-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">Cidade</label>
                <div className="relative">
                    <input
                        type="text"
                        name="city"
                        placeholder="Ex: São Paulo"
                        value={filters.city}
                        onChange={handleChange}
                        className="w-full pl-3 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                    />
                </div>
            </div>

            <div className="md:col-span-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">Tipo do Imóvel</label>
                <select
                    name="type"
                    value={filters.type}
                    onChange={handleChange}
                    className="w-full pl-3 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm appearance-none bg-white"
                >
                    <option value="">Selecione</option>
                    <option value="Apartamento">Apartamento</option>
                    <option value="Casa">Casa</option>
                    <option value="Terreno">Terreno</option>
                    <option value="Sala">Sala</option>
                    <option value="Sala comercial">Sala comercial</option>
                </select>
            </div>

            <div className="md:col-span-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">Categoria</label>
                <select
                    name="category"
                    value={filters.category}
                    onChange={handleChange}
                    className="w-full pl-3 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm appearance-none bg-white"
                >
                    <option value="">Todas</option>
                    <option value="Venda">Venda</option>
                    <option value="Aluguel">Aluguel</option>
                    <option value="Temporada">Temporada</option>
                </select>
            </div>

            <div className="md:col-span-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">Preço Máx.</label>
                <input
                    type="number"
                    name="maxPrice"
                    placeholder="R$ 0,00"
                    value={filters.maxPrice}
                    onChange={handleChange}
                    className="w-full pl-3 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                />
            </div>

            <div className="md:col-span-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">Quartos</label>
                <select
                    name="bedrooms"
                    value={filters.bedrooms}
                    onChange={handleChange}
                    className="w-full pl-3 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm appearance-none bg-white"
                >
                    <option value="">Qualquer</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                </select>
            </div>

            <div className="md:col-span-1">
                <Button type="submit" className="w-full gap-2">
                    <Search className="h-4 w-4" />
                    Buscar
                </Button>
            </div>
        </form>
    );
};

export default FilterBar;
