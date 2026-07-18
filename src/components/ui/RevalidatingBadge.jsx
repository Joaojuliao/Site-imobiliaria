import React from 'react';
import { RefreshCw } from 'lucide-react';

/**
 * Indicador sutil de revalidação em background.
 * Aparece discretamente quando o cache está sendo atualizado,
 * sem travar ou obscurecer a UI.
 */
const RevalidatingBadge = ({ show }) => {
  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-white border shadow-md rounded-full px-3 py-1.5 text-xs text-gray-500 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <RefreshCw className="h-3 w-3 animate-spin text-primary" />
      Atualizando...
    </div>
  );
};

export default RevalidatingBadge;