import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';
import { useDriveFolder } from '../hooks/useDriveFolder';
import { MapPin, Bed, Bath, Car, ArrowLeft, Share2, Heart, Phone, Calendar, Loader2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ImageLightbox from '../components/ui/ImageLightbox';
import { formatCurrency } from '../utils/formatters';
import useSEO from '../hooks/useSEO';

const DetailsSkeleton = () => (
  <div className="min-h-screen bg-white pb-20 animate-pulse">
    <div className="h-[50vh] bg-gray-200 w-full" />
    <div className="container mx-auto px-4 mt-8">
      <div className="bg-white rounded-xl shadow-xl border p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-6 w-24 bg-gray-200 rounded-full" />
          <div className="h-10 w-3/4 bg-gray-200 rounded" />
          <div className="h-5 w-1/2 bg-gray-200 rounded" />
          <div className="grid grid-cols-4 gap-4 py-6 border-y border-gray-100">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-gray-200 rounded-lg" />)}
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="border rounded-xl p-6 space-y-4">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-10 w-40 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded-lg w-full" />
            <div className="h-10 bg-gray-200 rounded-lg w-full" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PropertyDetails = () => {
  const { id } = useParams();
  const { properties, loading, favorites, toggleFavorite } = useProperties();
  const [property, setProperty] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useSEO(
    property?.title || 'Detalhes do Imóvel',
    property?.description?.substring(0, 160) || 'Confira todos os detalhes deste imóvel.'
  );

  useEffect(() => {
    if (properties.length > 0) {
      setProperty(properties.find(p => p.id.toString() === id) || null);
    }
  }, [properties, id]);

  const isFavorite = property ? favorites.includes(property.id) : false;

  const handleToggleFavorite = () => {
    if (property) toggleFavorite(property.id);
  };

  const { images: driveImages, loading: driveLoading } = useDriveFolder(
    property?.folderId || null
  );

  const images = driveImages.length > 0
    ? driveImages
    : property?.image ? [property.image] : [];

  if (loading || (!property && properties.length === 0)) return <DetailsSkeleton />;

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Imóvel não encontrado</h2>
        <p className="text-gray-500">O imóvel que você buscou não existe ou foi removido.</p>
        <Link to="/imoveis"><Button>Ver todos os imóveis</Button></Link>
      </div>
    );
  }

  const handleWhatsApp = () => {
    const text = `Olá! Tenho interesse no imóvel: ${property.title}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSchedule = () => {
    const text = `Olá! Gostaria de agendar uma visita: ${property.title}`;
    const phone = import.meta.env.VITE_WHATSAPP_NUMBER || '';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShare = async () => {
    try {
      if (navigator.share) await navigator.share({ title: property.title, url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); alert('Link copiado!'); }
    } catch { }
  };

  const openLightbox = (i) => { setCurrentImageIndex(i); setLightboxOpen(true); };
  const closeLightbox = () => setLightboxOpen(false);
  const nextImage = () => setCurrentImageIndex(p => (p + 1) % images.length);
  const prevImage = () => setCurrentImageIndex(p => (p - 1 + images.length) % images.length);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Gallery */}
      <div className="relative bg-gray-100">
        {driveLoading ? (
          <div className="h-[50vh] flex items-center justify-center bg-gray-100">
            <div className="flex flex-col items-center gap-3 text-gray-400">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="text-sm">Carregando fotos...</span>
            </div>
          </div>
        ) : images.length > 1 ? (
          <div className="grid gap-1">
            <div className="w-full h-[50vh] relative cursor-pointer" onClick={() => openLightbox(0)}>
              <img src={images[0]} alt={property.title} className="w-full h-full object-cover hover:opacity-90 transition-opacity" loading="lazy" />
              <div className="absolute top-4 left-4 z-10">
                <Link to="/imoveis" onClick={e => e.stopPropagation()}>
                  <Button variant="secondary" size="sm" className="gap-2"><ArrowLeft className="h-4 w-4" />Voltar</Button>
                </Link>
              </div>
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm font-medium">
                {images.length} fotos
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
              {images.slice(1).map((img, idx) => (
                <div key={idx} className="relative h-32 md:h-40 cursor-pointer" onClick={() => openLightbox(idx + 1)}>
                  <img src={img} alt={`${property.title} ${idx + 2}`} className="w-full h-full object-cover hover:opacity-90 transition-opacity rounded" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        ) : images.length === 1 ? (
          <div className="h-[60vh] relative cursor-pointer" onClick={() => openLightbox(0)}>
            <img src={images[0]} alt={property.title} className="w-full h-full object-cover hover:opacity-90 transition-opacity" loading="lazy" />
            <div className="absolute top-4 left-4 z-10">
              <Link to="/imoveis" onClick={e => e.stopPropagation()}>
                <Button variant="secondary" size="sm" className="gap-2"><ArrowLeft className="h-4 w-4" />Voltar</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="h-[20vh] flex items-center justify-center">
            <Link to="/imoveis"><Button variant="secondary" size="sm" className="gap-2"><ArrowLeft className="h-4 w-4" />Voltar</Button></Link>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="container mx-auto px-4 mt-8 relative z-20">
        <div className="bg-white rounded-xl shadow-xl border p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant={property.category === 'Venda' ? 'primary' : 'success'}>{property.category}</Badge>
                {property.featured && <Badge variant="warning">Destaque</Badge>}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{property.title}</h1>
              <div className="flex items-center gap-2 text-gray-500 text-lg">
                <MapPin className="h-5 w-5" />
                <span>{property.neighborhood}, {property.city}</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 py-6 border-y border-gray-100">
              {[
                { icon: <Bed className="h-6 w-6 mx-auto mb-2 text-primary" />, value: property.bedrooms, label: 'Quartos' },
                { icon: <Bath className="h-6 w-6 mx-auto mb-2 text-primary" />, value: property.bathrooms, label: 'Banheiros' },
                { icon: <Car className="h-6 w-6 mx-auto mb-2 text-primary" />, value: property.garage, label: 'Vagas' },
                { icon: <span className="block h-6 mb-2 text-primary font-bold text-xl">M²</span>, value: property.area, label: 'Área' },
              ].map(({ icon, value, label }) => (
                <div key={label} className="text-center p-4 bg-gray-50 rounded-lg">
                  {icon}
                  <span className="block font-bold text-lg">{value}</span>
                  <span className="text-xs text-gray-500">{label}</span>
                </div>
              ))}
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Sobre o imóvel</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>

            {property.mapsUrl && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Localização</h2>
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-100 border">
                  <iframe src={property.mapsUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white border rounded-xl p-6 shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Valor do imóvel</p>
                <p className="text-3xl font-bold text-primary mb-6">{formatCurrency(property.price)}</p>
                <div className="space-y-3">
                  <Button onClick={handleWhatsApp} className="w-full gap-2 bg-green-600 hover:bg-green-700">
                    <Phone className="h-4 w-4" />Falar no WhatsApp
                  </Button>
                  <Button variant="outline" onClick={handleSchedule} className="w-full gap-2">
                    <Calendar className="h-4 w-4" />Agendar Visita
                  </Button>
                </div>
                {property.corretor && (
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Anunciado por</p>
                    <p className="text-sm font-semibold text-gray-900">{property.corretor}</p>
                  </div>
                )}
              </div>


              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1 gap-2" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />Compartilhar
                </Button>
                <button
                  onClick={handleToggleFavorite}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-sm transition-all duration-300 border ${isFavorite
                      ? 'bg-red-500 border-red-500 text-white hover:bg-red-600'
                      : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                  {isFavorite ? 'Salvo' : 'Salvar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {lightboxOpen && images.length > 0 && (
        <ImageLightbox images={images} currentIndex={currentImageIndex} onClose={closeLightbox} onNext={nextImage} onPrev={prevImage} />
      )}
    </div>
  );
};

export default PropertyDetails;