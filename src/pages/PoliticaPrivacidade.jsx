import React from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useLgpdConfig } from '../hooks/useLgpdConfig';
import useSEO from '../hooks/useSEO';

const PoliticaPrivacidade = () => {
    useSEO(
        'Política de Privacidade',
        'Saiba como tratamos e protegemos seus dados pessoais, em conformidade com a LGPD.'
    );
    const { config, loading } = useLgpdConfig();

    return (
        <div className="bg-white min-h-screen">
            <section className="bg-gray-900 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 mb-4">
                        <ShieldCheck className="h-7 w-7" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">Política de Privacidade</h1>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        Em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018).
                    </p>
                </div>
            </section>

            <section className="container mx-auto px-4 py-16 max-w-3xl">
                {loading ? (
                    <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="text-sm">Carregando...</span>
                    </div>
                ) : (
                    <div className="whitespace-pre-line text-gray-700 leading-relaxed text-[15px]">
                        {config.privacyPolicyText}
                    </div>
                )}
            </section>
        </div>
    );
};

export default PoliticaPrivacidade;