/**
 * Sistema de ícones dos pins do mapa — espelha lib/mapa/pin-icon.tsx do
 * painel administrativo (Next.js), que usa React + react-dom/server +
 * lucide-react para gerar o mesmo SVG. Esse arquivo não pode ser importado
 * diretamente pelo site público (stack Vite separada), então a lógica de
 * mapeamento nome → ícone foi extraída para este módulo, mantendo:
 *
 *   - os mesmos valores de ICON_OPTIONS usados no seletor do painel;
 *   - o mesmo ICON_MAP (nome salvo no Firestore → ícone Lucide);
 *   - o mesmo resultado visual, pois os corpos de SVG abaixo foram
 *     extraídos de lucide-static na MESMA versão do lucide-react já usada
 *     neste projeto (0.555.0) — são os ícones pixel-a-pixel idênticos aos
 *     componentes React (Home, Building2, Building, MapPin, Star, Flag,
 *     Landmark, Store, KeyRound, LocateFixed), só que como markup estático,
 *     que é o formato que o Leaflet (L.divIcon) precisa.
 *
 * Se o painel adicionar/alterar ícones em pin-icon.tsx, replique a mudança
 * aqui para os dois lados continuarem batendo.
 */

// Mesmos valores/rótulos do seletor de ícone do painel.
export const ICON_OPTIONS = [
  { value: 'home', label: 'Casa' },
  { value: 'building', label: 'Prédio' },
  { value: 'house', label: 'Casa (alternativo)' },
  { value: 'map-pin', label: 'Pin' },
  { value: 'star', label: 'Destaque' },
  { value: 'flag', label: 'Bandeira' },
  { value: 'office', label: 'Escritório' },
  { value: 'store', label: 'Loja' },
  { value: 'key', label: 'Chave' },
  { value: 'location-dot', label: 'Localização' },
];

// nome salvo no Firestore (campo "icone") → ícone Lucide correspondente.
// Mantém a mesma tabela de compatibilidade do painel:
//   home → Home · building → Building2 · house → Building
//   map-pin → MapPin · star → Star · flag → Flag · office → Landmark
//   store → Store · key → KeyRound · location-dot → LocateFixed
export const ICON_MAP = {
  home: 'Home',
  building: 'Building2',
  house: 'Building',
  'map-pin': 'MapPin',
  star: 'Star',
  flag: 'Flag',
  office: 'Landmark',
  store: 'Store',
  key: 'KeyRound',
  'location-dot': 'LocateFixed',
};

// Corpo (filhos) de cada <svg> do Lucide, extraído de lucide-static@0.555.0
// — a mesma versão do lucide-react já instalada no projeto — para garantir
// que sejam exatamente os ícones que o painel renderiza.
const ICON_BODIES = {
  home:
    '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />' +
    '<path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />',
  building:
    '<path d="M10 12h4" />' +
    '<path d="M10 8h4" />' +
    '<path d="M14 21v-3a2 2 0 0 0-4 0v3" />' +
    '<path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" />' +
    '<path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />',
  house:
    '<path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M12 6h.01" />' +
    '<path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M16 6h.01" />' +
    '<path d="M8 10h.01" /><path d="M8 14h.01" /><path d="M8 6h.01" />' +
    '<path d="M9 22v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />' +
    '<rect x="4" y="2" width="16" height="20" rx="2" />',
  'map-pin':
    '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />' +
    '<circle cx="12" cy="10" r="3" />',
  star:
    '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />',
  flag:
    '<path d="M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528" />',
  office:
    '<path d="M10 18v-7" />' +
    '<path d="M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z" />' +
    '<path d="M14 18v-7" /><path d="M18 18v-7" /><path d="M3 22h18" /><path d="M6 18v-7" />',
  store:
    '<path d="M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5" />' +
    '<path d="M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244" />' +
    '<path d="M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05" />',
  key:
    '<path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />' +
    '<circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />',
  'location-dot':
    '<line x1="2" x2="5" y1="12" y2="12" /><line x1="19" x2="22" y1="12" y2="12" />' +
    '<line x1="12" x2="12" y1="2" y2="5" /><line x1="12" x2="12" y1="19" y2="22" />' +
    '<circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="3" />',
};

const DEFAULT_ICON_NAME = 'home';

/**
 * Gera o markup de um <svg> Lucide completo e autocontido, pronto para ser
 * embutido em HTML estático (ex.: L.divIcon do Leaflet). Faz fallback para
 * "home" quando `name` não é reconhecido — mesmo comportamento do painel.
 *
 * @param {string} name - valor salvo no campo "icone" (ex.: "building")
 * @param {{ color?: string, size?: number, strokeWidth?: number }} [options]
 */
export function iconSvgMarkup(name, options = {}) {
  const { color = '#ffffff', size = 18, strokeWidth = 2 } = options;
  const body = ICON_BODIES[name] || ICON_BODIES[DEFAULT_ICON_NAME];

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" ` +
    `fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" ` +
    `stroke-linejoin="round" style="color:${color}" aria-hidden="true">${body}</svg>`
  );
}

export default iconSvgMarkup;