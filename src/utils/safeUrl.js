/**
 * Validação de URLs vindas de fontes externas (planilha do Google Sheets,
 * documentos do Firestore) antes de usá-las em contextos sensíveis como
 * `<iframe src>` ou `<a href target="_blank">`.
 *
 * Por que isto existe (auditoria de segurança):
 * O campo `url_maps` de um imóvel vem de uma célula de planilha preenchida
 * manualmente pela imobiliária. Nada impede, hoje, que essa célula acabe
 * com um valor inesperado (erro de copy/paste, uma URL de terceiros, ou —
 * num cenário mais grave — uma planilha comprometida). Sem validação, esse
 * valor vai direto para `<iframe src={...}>`, o que permite embutir
 * qualquer página de terceiros dentro do site (risco de clickjacking/
 * phishing usando a confiança no domínio da imobiliária).
 *
 * `isGoogleMapsEmbedUrl` garante que só aceitamos embeds do próprio Google
 * Maps. Qualquer outra coisa é tratada como "sem mapa disponível".
 */

const ALLOWED_MAPS_HOSTS = new Set([
  'www.google.com',
  'maps.google.com',
  'google.com',
]);

export function isGoogleMapsEmbedUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return false;
    if (!ALLOWED_MAPS_HOSTS.has(parsed.hostname)) return false;
    // Embeds legítimos do Google Maps usam o caminho /maps/embed...
    return parsed.pathname.startsWith('/maps/embed');
  } catch {
    return false;
  }
}

export default isGoogleMapsEmbedUrl;