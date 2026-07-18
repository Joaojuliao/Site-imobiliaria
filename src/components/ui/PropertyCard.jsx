import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Car, ArrowRight, Heart, ImageOff } from 'lucide-react';
import { formatCurrency, truncateText } from '../../utils/formatters';
import Badge from './Badge';
import Button from './Button';
import { useProperties } from '../../context/PropertyContext';

const PropertyCard = ({ property }) => {
  const { favorites, toggleFavorite } = useProperties();
  const isFavorite = favorites.includes(property.id);

  const displayImage = property.image || null;

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property.id);
  };

  return (
    <Link
      to={`/imovel/${property.id}`}
      className="group relative bg-white rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full block"
    >
      <button
        onClick={handleToggleFavorite}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 border shadow-sm ${
          isFavorite
            ? 'bg-red-500 border-red-500 text-white'
            : 'bg-white/80 hover:bg-white border-white/20 text-gray-600 hover:text-red-500'
        }`}
      >
        <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
      </button>

      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {displayImage ? (
          <img
            src={displayImage}
            alt={property.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
            <ImageOff className="h-10 w-10" />
            <span className="text-xs">Sem imagem</span>
          </div>
        )}

        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant={property.category === 'Venda' ? 'primary' : 'success'}>
            {property.category}
          </Badge>
          {property.featured && <Badge variant="warning">Destaque</Badge>}
        </div>

        {displayImage && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-12">
            <p className="text-white font-bold text-xl">{formatCurrency(property.price)}</p>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="mb-2">
          <h3 className="font-semibold text-lg leading-tight text-gray-900 group-hover:text-primary transition-colors">
            {truncateText(property.title, 50)}
          </h3>
          <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
            <MapPin className="h-3.5 w-3.5" />
            <span>{property.neighborhood}, {property.city}</span>
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-t border-b border-gray-100 my-3 text-sm text-gray-600">
          <div className="flex items-center gap-1.5" title={`${property.bedrooms} Quartos`}>
            <Bed className="h-4 w-4" /><span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1.5" title={`${property.bathrooms} Banheiros`}>
            <Bath className="h-4 w-4" /><span>{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1.5" title={`${property.garage} Vagas`}>
            <Car className="h-4 w-4" /><span>{property.garage}</span>
          </div>
          <div className="flex items-center gap-1.5" title={`${property.area} m²`}>
            <span className="font-medium text-xs border border-gray-300 rounded px-1">M²</span>
            <span>{property.area}</span>
          </div>
        </div>

        <div className="mt-auto pt-2">
          <Button
            variant="outline"
            className="w-full justify-between group-hover:bg-primary group-hover:text-white group-hover:border-primary"
          >
            Ver Detalhes
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;