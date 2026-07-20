/**
 * useLgpdConfig — lê as configurações de LGPD da imobiliária atual em
 * imobiliarias/{tenant}/configuracoes/lgpd e expõe defaults seguros
 * enquanto a leitura acontece ou caso o documento ainda não exista
 * (imobiliária que nunca abriu o painel de configurações).
 *
 * Defaults: cookieNoticeEnabled = true, privacyConsentRequired = true.
 * São os mesmos defaults do painel administrativo — na ausência de
 * configuração explícita, o site se comporta da forma mais conservadora
 * (avisa sobre cookies e exige concordância com a política).
 */

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const SUBDOMAIN = import.meta.env.VITE_SUBDOMAIN;

export const DEFAULT_PRIVACY_POLICY_TEXT = `Em atenção à LGPD, foram tomadas todas as medidas cabíveis em respeito à sua privacidade com relação às informações e proteção de dados coletadas neste site.

As informações armazenadas são: Nome, Telefone, E-mail, dados sobre o tipo/perfil de imóvel procurado e páginas visitadas nesse site.

Com relação a Cookies de terceiros serão coletadas: informações sobre o tempo de acesso no site, páginas visitadas e demais informações relevantes do Google Analytics. Dados para re-marketing em ferramentas externas, como por exemplo o serviço oferecido pelo Facebook (Meta). Para maiores informações sobre os cookies dos serviços de terceiros, acesse os sites oficiais dos respectivos serviços.

Este site possui o fim de coletar informações para:

- Criar seu cadastro como lead;
- Localizar imóveis compatíveis, baseados no tipo de imóvel ideal para você;
- Determinar os imóveis mais atraentes para o público;
- Criação, divulgação e envio de conteúdos relevantes.

Não são compartilhadas informações pessoais de forma pública ou com terceiros, exceto em serviços com finalidade comercial no ramo imobiliário ou quando a lei exigir.

As informações recebidas serão solicitadas no menu "Contato", nos Formulários de Contato dos Imóveis, no menu "Negocie seu Imóvel", no formulário de contato da galeria de imagens, no formulário do pop-up e em eventuais menus criados.

Todas as informações serão previamente solicitadas a você, não tendo captura de nenhuma informação pessoal de maneira automática.

Você pode não aceitar o envio das informações, porém alguns serviços desejados não serão concluídos sem que estas informações sejam recebidas.

Você pode solicitar a exclusão das suas informações a qualquer momento entrando em contato pelos meios disponibilizados no site.

Você pode desativar os Cookies em seu navegador a qualquer momento, porém a desativação pode afetar a usabilidade e funcionalidade não só de nosso site, como também de outros sites que você visitar.`;

const DEFAULT_CONFIG = {
  cookieNoticeEnabled: true,
  privacyConsentRequired: true,
  privacyPolicyText: DEFAULT_PRIVACY_POLICY_TEXT,
};

// Cache simples em memória por sessão de página — evita re-buscar o mesmo
// documento toda vez que o hook é usado em componentes diferentes
// (CookieNotice, PoliticaPrivacidade, LgpdConsentCheckbox etc. no mesmo load).
let cachedConfig = null;
let cachedPromise = null;

function fetchLgpdConfig() {
  if (cachedPromise) return cachedPromise;

  cachedPromise = (async () => {
    if (!SUBDOMAIN) {
      console.error('VITE_SUBDOMAIN não configurada — usando defaults de LGPD.');
      return DEFAULT_CONFIG;
    }

    try {
      // imobiliarias/{tenant}/configuracoes/lgpd — isolado por tenant,
      // nunca uma coleção global compartilhada entre imobiliárias.
      const ref = doc(db, 'imobiliarias', SUBDOMAIN, 'configuracoes', 'lgpd');
      const snap = await getDoc(ref);
      if (!snap.exists()) return DEFAULT_CONFIG;

      const data = snap.data();
      const merged = {
        cookieNoticeEnabled: data.cookieNoticeEnabled !== false,
        privacyConsentRequired: data.privacyConsentRequired !== false,
        privacyPolicyText: data.privacyPolicyText?.trim()
          ? data.privacyPolicyText
          : DEFAULT_PRIVACY_POLICY_TEXT,
      };
      cachedConfig = merged;
      return merged;
    } catch (err) {
      console.error('Erro ao carregar configurações de LGPD:', err);
      return DEFAULT_CONFIG;
    }
  })();

  return cachedPromise;
}

export function useLgpdConfig() {
  const [config, setConfig] = useState(cachedConfig || DEFAULT_CONFIG);
  const [loading, setLoading] = useState(!cachedConfig);

  useEffect(() => {
    let cancelled = false;

    if (cachedConfig) {
      setConfig(cachedConfig);
      setLoading(false);
      return;
    }

    fetchLgpdConfig().then((cfg) => {
      if (!cancelled) {
        setConfig(cfg);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, []);

  return { config, loading };
}