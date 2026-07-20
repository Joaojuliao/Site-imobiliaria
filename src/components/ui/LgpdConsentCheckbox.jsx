import React from 'react';
import { Link } from 'react-router-dom';
import { useLgpdConfig } from '../../hooks/useLgpdConfig';

/**
 * Checkbox de concordância com a Política de Privacidade.
 *
 * Só aparece (e só é obrigatório) quando a imobiliária tem
 * `privacyConsentRequired` ativado em imobiliarias/{tenant}/configuracoes/lgpd.
 * Se a imobiliária desativar a opção no painel, o checkbox some do
 * formulário automaticamente — sem precisar mexer em código.
 *
 * Reutilize este componente em QUALQUER formulário que colete dados
 * pessoais (contato, negocie, popups, formulário da galeria etc.) em vez
 * de duplicar o checkbox manualmente — assim uma mudança na configuração
 * da imobiliária reflete em todos os formulários de uma vez.
 *
 * Uso:
 *   <LgpdConsentCheckbox checked={formData.check} onChange={handleChange} />
 * (o input usa name="check" por padrão para bater com o handleChange
 * genérico já usado nos formulários existentes; pode ser sobrescrito)
 */
const LgpdConsentCheckbox = ({ checked, onChange, name = 'check' }) => {
  const { config, loading } = useLgpdConfig();

  if (loading || !config.privacyConsentRequired) return null;

  return (
    <label className="flex items-start gap-4 cursor-pointer group">
      <input
        type="checkbox"
        name={name}
        required
        className="w-5 h-5 rounded border-gray-300 text-primary mt-1"
        checked={checked}
        onChange={onChange}
      />
      <span className="text-sm text-gray-600 leading-relaxed">
        Li e concordo com a{' '}
        <Link
          to="/politica-de-privacidade"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-bold hover:underline"
        >
          Política de Privacidade
        </Link>.
      </span>
    </label>
  );
};

export default LgpdConsentCheckbox;