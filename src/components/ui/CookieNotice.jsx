import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X } from 'lucide-react';
import Button from './Button';
import { useLgpdConfig } from '../../hooks/useLgpdConfig';

const SUBDOMAIN = import.meta.env.VITE_SUBDOMAIN;

// Chave isolada por tenant — cookie_consent_{tenantId}, exatamente como
// especificado. Guarda só a preferência ('accepted' | 'dismissed'), nunca
// dados pessoais do visitante.
function storageKey() {
  return `cookie_consent_${SUBDOMAIN || 'default'}`;
}

const CookieNotice = () => {
  const { config, loading } = useLgpdConfig();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (loading || !config.cookieNoticeEnabled) return;
    try {
      const stored = localStorage.getItem(storageKey());
      if (!stored) setVisible(true);
    } catch {
      // localStorage indisponível (modo privado, etc.) — mostra o aviso
      // mesmo assim, só não persiste a escolha entre sessões.
      setVisible(true);
    }
  }, [loading, config.cookieNoticeEnabled]);

  const decide = (value) => {
    try { localStorage.setItem(storageKey(), value); } catch { /* noop */ }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[60] p-4 sm:p-6">
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 shadow-xl rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
            <Cookie className="h-5 w-5" />
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Este site utiliza cookies para melhorar sua experiência, analisar a navegação e oferecer
            funcionalidades personalizadas. Saiba mais em nossa{' '}
            <Link to="/politica-de-privacidade" className="text-primary font-semibold hover:underline">
              Política de Privacidade
            </Link>.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <Button variant="ghost" size="sm" onClick={() => decide('dismissed')} className="gap-1">
            <X className="h-4 w-4" />
            Fechar
          </Button>
          <Button size="sm" onClick={() => decide('accepted')} className="flex-1 sm:flex-none">
            Aceitar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieNotice;