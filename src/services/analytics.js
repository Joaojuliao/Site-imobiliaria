/**
 * Carregamento do Google Analytics (gtag.js) — condicionado ao
 * consentimento de cookies do visitante (LGPD).
 *
 * Antes deste ajuste, o gtag.js e sua inicialização viviam como um
 * <script> fixo em index.html:
 *   1) Isso obrigava a CSP a aceitar 'unsafe-inline' em script-src (ou
 *      um hash frágil, que quebra a cada mudança no conteúdo do script)
 *      só para permitir esse bloco — enfraquecendo a proteção contra
 *      injeção de script via XSS para o site inteiro.
 *   2) O gtag.js carregava para TODO visitante, independente de ele ter
 *      aceitado o CookieNotice — o aviso de cookies existia, mas não
 *      controlava nada de fato.
 *
 * A correção resolve os dois problemas de uma vez: a inicialização virou
 * código normal do bundle (servido pela própria origem — coberto por
 * 'self' em script-src, sem exceção nenhuma), e o script remoto do
 * Google só é injetado no DOM quando há consentimento.
 *
 * Chame loadGoogleAnalytics() a partir do CookieNotice, nunca direto no
 * carregamento da página — é ele quem sabe se o visitante já aceitou.
 */

const GA_MEASUREMENT_ID = 'G-SG6XGDH5J0';

let loaded = false;

export function loadGoogleAnalytics() {
  if (loaded) return;
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (!GA_MEASUREMENT_ID) return;

  loaded = true;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}