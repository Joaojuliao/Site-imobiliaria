import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { MapPin, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { formatCurrency, truncateText } from '../../utils/formatters';
import { iconSvgMarkup } from '../../utils/pinIcons';

// O nome/slug da imobiliária vem da configuração do próprio deploy — o
// mesmo padrão já usado em Negocie.jsx — para que este componente funcione
// sem alteração em qualquer site white-label.
const TENANT = import.meta.env.VITE_SUBDOMAIN;
const DEFAULT_PIN_COLOR = '#FF385C';

/* ────────────────────────────────────────────────────────────────────────
 * Validação e leitura dos documentos de imoveis_no_mapa
 * ──────────────────────────────────────────────────────────────────────── */

function isValidLatLng(lat, lng) {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 && lat <= 90 &&
    lng >= -180 && lng <= 180 &&
    !(lat === 0 && lng === 0)
  );
}

// O campo "url" nesta coleção normalmente guarda uma imagem maior (thumbnail
// do Drive), não um link de página. Só tratamos "url" como destino de
// navegação quando ele claramente não aponta para uma imagem.
function looksLikeImageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  if (/\.(png|jpe?g|webp|gif|avif)(\?|$)/i.test(url)) return true;
  if (/drive\.google\.com\/thumbnail/i.test(url)) return true;
  return false;
}

function resolvePropertyHref(data) {
  if (data.url && !looksLikeImageUrl(data.url)) {
    return { type: 'external', href: data.url };
  }
  if (data.codigo) {
    return { type: 'internal', href: `/imovel/${data.codigo}` };
  }
  return null;
}

function buildMarkerFromDoc(docSnap) {
  const data = docSnap.data() || {};

  if (data.localizacaoPendente === true) return null;

  const lat = Number(data.latitude);
  const lng = Number(data.longitude);
  if (!isValidLatLng(lat, lng)) return null;

  const priceNumber = data.preco !== undefined && data.preco !== null && data.preco !== ''
    ? Number(data.preco)
    : null;

  return {
    id: docSnap.id,
    position: [lat, lng],
    color: data.cor || DEFAULT_PIN_COLOR,
    icon: data.icone || 'home',
    title: data.titulo || 'Imóvel',
    price: Number.isFinite(priceNumber) ? priceNumber : null,
    codigo: data.codigo || null,
    address: data.endereco || '',
    description: data.descricao || '',
    image: data.imagem || data.url || null,
    href: resolvePropertyHref(data),
  };
}

/* ────────────────────────────────────────────────────────────────────────
 * Ícone do pin: badge circular colorido (campo "cor") com anel branco,
 * ponta inferior apontando para a coordenada exata e sombra suave — mesmo
 * visual do painel administrativo. O glifo interno vem do sistema de
 * ícones compartilhado (src/utils/pinIcons.js), então "building", "home",
 * "store" etc. renderizam exatamente o mesmo ícone Lucide dos dois lados.
 * Os ícones são memorizados por combinação de cor+tipo para não recriar
 * SVG/DOM a cada render.
 * ──────────────────────────────────────────────────────────────────────── */

const PIN_WIDTH = 36;
const PIN_HEIGHT = 46;
const PIN_TIP = [PIN_WIDTH / 2, 39]; // ponta do marcador = coordenada real no mapa
const PIN_GLYPH_SIZE = 16;

const iconCache = new Map();

function createPinIcon(color, iconName) {
  const cacheKey = `${color}|${iconName}`;
  if (iconCache.has(cacheKey)) return iconCache.get(cacheKey);

  const glyphMarkup = iconSvgMarkup(iconName, { color: '#ffffff', size: PIN_GLYPH_SIZE, strokeWidth: 2.25 });
  const glyphOffset = (PIN_WIDTH - PIN_GLYPH_SIZE) / 2; // centraliza o glifo no círculo

  const html = `
    <div class="properties-map-pin" style="position:relative;width:${PIN_WIDTH}px;height:${PIN_HEIGHT}px;">
      <svg width="${PIN_WIDTH}" height="${PIN_HEIGHT}" viewBox="0 0 ${PIN_WIDTH} ${PIN_HEIGHT}" style="position:absolute;inset:0;">
        <ellipse cx="${PIN_TIP[0]}" cy="${PIN_HEIGHT - 4}" rx="6" ry="2" fill="rgba(15,23,42,0.28)" />
        <path d="M10.5 23 L${PIN_TIP[0]} ${PIN_TIP[1]} L25.5 23 Z" fill="${color}" />
        <circle cx="18" cy="16" r="13.5" fill="${color}" stroke="#ffffff" stroke-width="2.5" />
      </svg>
      <div style="position:absolute;top:${glyphOffset - 2}px;left:${glyphOffset}px;width:${PIN_GLYPH_SIZE}px;height:${PIN_GLYPH_SIZE}px;">
        ${glyphMarkup}
      </div>
    </div>
  `;

  const icon = L.divIcon({
    html,
    className: 'properties-map-pin-wrapper',
    iconSize: [PIN_WIDTH, PIN_HEIGHT],
    iconAnchor: PIN_TIP,
    popupAnchor: [0, -(PIN_TIP[1] - 6)],
  });

  iconCache.set(cacheKey, icon);
  return icon;
}

/* ──────────────────────────────────────────────────────────────────────── */

// Ajusta o enquadramento do mapa para caber todos os pins (ou centraliza no
// único imóvel disponível) sem precisar recriar o MapContainer.
function FitBounds({ points }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;

    if (points.length === 1) {
      map.setView(points[0], 15);
      return;
    }

    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 16 });
  }, [points, map]);

  return null;
}

function MapSectionShell({ children }) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Encontre nossos imóveis no mapa</h2>
          <p className="text-gray-500 mt-2">Explore a localização dos imóveis disponíveis.</p>
        </div>
        {children}
      </div>
    </section>
  );
}

function StateBox({ icon, message, tone = 'neutral' }) {
  const toneClasses = tone === 'error'
    ? 'border-red-200 bg-red-50 text-red-600'
    : 'border-dashed border-gray-200 bg-gray-50 text-gray-500';

  return (
    <div className={`h-[400px] sm:h-[450px] lg:h-[500px] w-full rounded-2xl border flex items-center justify-center ${toneClasses}`}>
      <div className="text-center px-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white border border-gray-200 mb-4">
          {icon}
        </div>
        <p className="max-w-sm">{message}</p>
      </div>
    </div>
  );
}

const PropertiesMap = () => {
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [rawDocs, setRawDocs] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadMapProperties() {
      if (!TENANT) {
        if (isMounted) {
          setErrorMessage('Configuração da imobiliária (VITE_SUBDOMAIN) não encontrada.');
          setStatus('error');
        }
        return;
      }

      try {
        const snapshot = await getDocs(collection(db, 'imobiliarias', TENANT, 'imoveis_no_mapa'));
        if (!isMounted) return;
        setRawDocs(snapshot.docs);
        setStatus('ready');
      } catch (err) {
        console.error('Erro ao carregar imóveis do mapa:', err);
        if (!isMounted) return;
        setErrorMessage('Não foi possível carregar o mapa de imóveis. Tente novamente mais tarde.');
        setStatus('error');
      }
    }

    loadMapProperties();
    return () => { isMounted = false; };
  }, []);

  const markers = useMemo(() => {
    return rawDocs.map(buildMarkerFromDoc).filter(Boolean);
  }, [rawDocs]);

  if (status === 'loading') {
    return (
      <MapSectionShell>
        <div className="h-[400px] sm:h-[450px] lg:h-[500px] w-full rounded-2xl border border-gray-200 bg-gray-100 animate-pulse flex items-center justify-center">
          <div className="flex items-center gap-2 text-gray-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Carregando mapa de imóveis...</span>
          </div>
        </div>
      </MapSectionShell>
    );
  }

  if (status === 'error') {
    return (
      <MapSectionShell>
        <StateBox
          icon={<AlertCircle className="h-7 w-7 text-red-400" />}
          message={errorMessage}
          tone="error"
        />
      </MapSectionShell>
    );
  }

  if (markers.length === 0) {
    return (
      <MapSectionShell>
        <StateBox
          icon={<MapPin className="h-7 w-7 text-gray-300" />}
          message="Nenhum imóvel com localização cadastrada no mapa no momento."
        />
      </MapSectionShell>
    );
  }

  const points = markers.map((marker) => marker.position);

  return (
    <MapSectionShell>
      {/* L.divIcon sempre recebe a classe base "leaflet-div-icon", que o
          leaflet.css estiliza com fundo branco e borda — sem isso o pin
          customizado apareceria dentro de uma caixinha branca indesejada. */}
      <style>{`
        .leaflet-div-icon.properties-map-pin-wrapper {
          background: transparent;
          border: none;
        }
      `}</style>
      <div className="h-[400px] sm:h-[450px] lg:h-[500px] w-full rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
        <MapContainer
          center={points[0]}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds points={points} />
          {markers.map((marker) => (
            <Marker key={marker.id} position={marker.position} icon={createPinIcon(marker.color, marker.icon)}>
              <Popup minWidth={230} maxWidth={260}>
                <div className="w-full">
                  {marker.image && (
                    <img
                      src={marker.image}
                      alt={marker.title}
                      className="w-full h-28 object-cover rounded-md mb-2"
                      loading="lazy"
                    />
                  )}
                  <p className="font-semibold text-sm text-gray-900 leading-tight mb-1">
                    {marker.title}
                  </p>
                  {marker.price !== null && (
                    <p className="text-primary font-bold text-sm mb-1">
                      {formatCurrency(marker.price)}
                    </p>
                  )}
                  {marker.codigo && (
                    <p className="text-xs text-gray-400 mb-1">Código: {marker.codigo}</p>
                  )}
                  {marker.address && (
                    <p className="text-xs text-gray-500 flex items-start gap-1 mb-1">
                      <MapPin className="h-3 w-3 shrink-0 mt-0.5" />
                      <span>{marker.address}</span>
                    </p>
                  )}
                  {marker.description && (
                    <p className="text-xs text-gray-500 mb-3">
                      {truncateText(marker.description, 110)}
                    </p>
                  )}
                  {marker.href?.type === 'internal' && (
                    <Link
                      to={marker.href.href}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      Ver imóvel <ArrowRight className="h-3 w-3" />
                    </Link>
                  )}
                  {marker.href?.type === 'external' && (
                    <a
                      href={marker.href.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      Ver imóvel <ArrowRight className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </MapSectionShell>
  );
};

export default PropertiesMap;