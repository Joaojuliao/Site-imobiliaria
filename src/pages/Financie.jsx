import React from 'react';
import { Landmark, Calculator, FileText, CheckCircle2, ArrowRight, ShieldCheck, Clock, BadgePercent } from 'lucide-react';
import useSEO from '../hooks/useSEO';

const Financie = () => {
    useSEO('Financie seu Imóvel', 'Simule seu financiamento imobiliário com os principais bancos e encontre as melhores taxas do mercado.');
    const steps = [
        {
            icon: <Calculator className="h-8 w-8 text-primary" />,
            title: "Simulação",
            description: "Realize uma simulação inicial para entender as parcelas e o valor de entrada necessário para seu perfil."
        },
        {
            icon: <FileText className="h-8 w-8 text-primary" />,
            title: "Análise de Crédito",
            description: "Envie a documentação necessária para que as instituições financeiras avaliem seu potencial de crédito."
        },
        {
            icon: <ShieldCheck className="h-8 w-8 text-primary" />,
            title: "Aprovação",
            description: "Com o crédito aprovado, você já sabe exatamente quanto pode investir no seu novo imóvel."
        },
        {
            icon: <CheckCircle2 className="h-8 w-8 text-primary" />,
            title: "Assinatura",
            description: "Finalize o processo com a assinatura do contrato de financiamento e a realização do seu sonho."
        }
    ];

    const banks = [
        {
            name: "Bradesco",
            logo: "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/logos/banks/bradesco.png",
            url: "https://banco.bradesco/html/classic/produtos-servicos/emprestimo-e-financiamento/encontre-seu-credito/simuladores-imoveis.shtm"
        },
        {
            name: "Banrisul",
            logo: "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/logos/banks/branrisul.png",
            url: "http://www.banrisul.com.br/bob/link/bobw02hn_conteudo_lista2.aspx?secao_id=1069"
        },
        {
            name: "Itaú",
            logo: "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/logos/banks/itau.png",
            url: "https://credito-imobiliario.itau.com.br/proposta"
        },
        {
            name: "Santander",
            logo: "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/logos/banks/santander.png",
            url: "https://www.negociosimobiliarios.santander.com.br/negociosimobiliarios/#/dados-pessoais"
        },
        {
            name: "Banco do Brasil",
            logo: "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/logos/banks/bancobrasil.png",
            url: "https://cim-simulador-imovelproprio.apps.bb.com.br/simulacao-imobiliario/sobre-imovel"
        },
        {
            name: "Caixa",
            logo: "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/logos/banks/caixa.png",
            url: "https://www8.caixa.gov.br/siopiinternet-web/simulaOperacaoInternet.do?method=inicializarCasoUso"
        }
    ];

    const benefits = [
        {
            icon: <BadgePercent className="h-6 w-6 text-green-600" />,
            title: "Taxas Competitivas",
            description: "Trabalhamos com os principais bancos para garantir as melhores taxas de juros do mercado."
        },
        {
            icon: <Clock className="h-6 w-6 text-green-600" />,
            title: "Agilidade",
            description: "Processos desburocratizados para que você receba sua aprovação no menor tempo possível."
        },
        {
            icon: <Landmark className="h-6 w-6 text-green-600" />,
            title: "Multibancos",
            description: "Comparamos as condições em diversas instituições para você escolher a mais vantajosa."
        }
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 bg-gray-900 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Seu sonho da casa própria começa aqui</h1>
                        <p className="text-xl text-gray-300 mb-8">
                            Ajudamos você a encontrar as melhores condições de financiamento imobiliário. Processo rápido, seguro e totalmente transparente.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a href="#simuladores" className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/30 px-8 py-3 rounded-lg font-semibold transition-colors">
                                Simular Agora
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Simulators Section */}
            <section id="simuladores" className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900">Simule seu financiamento</h2>
                        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                            Escolha o seu banco de preferência e faça uma simulação agora mesmo para descobrir as condições ideais para você.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {banks.map((bank, index) => (
                            <a
                                key={index}
                                href={bank.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col items-center justify-between hover:shadow-xl hover:border-primary/20 transition-all group"
                            >
                                <div className="h-16 flex items-center justify-center mb-6">
                                    <img
                                        src={bank.logo}
                                        alt={bank.name}
                                        title={bank.name}
                                        className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all"
                                    />
                                </div>
                                <span className="bg-gray-100 group-hover:bg-primary group-hover:text-white text-gray-600 text-xs font-bold py-2 px-4 rounded-full transition-colors w-full text-center">
                                    Simular
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Steps Section */}
            <section className="py-20 container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900">Como funciona o processo?</h2>
                    <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                        Entenda o passo a passo simplificado para adquirir o seu financiamento imobiliário conosco.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 relative group hover:shadow-lg transition-shadow">
                            <div className="mb-6 p-3 bg-white rounded-lg inline-block shadow-sm">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                            <p className="text-gray-600">{step.description}</p>
                            <div className="absolute -top-4 -right-4 text-6xl font-black text-gray-200 opacity-50 group-hover:opacity-80 transition-opacity select-none">
                                {index + 1}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                        <div className="flex flex-col lg:flex-row">
                            <div className="lg:w-1/2 p-12 lg:p-16">
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Por que financiar com a gente?</h2>
                                <p className="text-gray-600 mb-10">
                                    Temos parcerias com as maiores instituições financeiras do país, garantindo que você tenha acesso às melhores ofertas.
                                </p>

                                <div className="space-y-8">
                                    {benefits.map((benefit, index) => (
                                        <div key={index} className="flex gap-4">
                                            <div className="flex-shrink-0 mt-1">
                                                {benefit.icon}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 mb-1">{benefit.title}</h4>
                                                <p className="text-gray-600">{benefit.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="lg:w-1/2 bg-[url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center min-h-[400px]"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 container mx-auto px-4 text-center">
                <div className="bg-primary rounded-3xl p-12 lg:p-20 text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para dar o próximo passo?</h2>
                    <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
                        Nossos consultores estão prontos para tirar todas as suas dúvidas e ajudar você a conquistar o seu imóvel.
                    </p>
                    <button className="bg-white text-primary hover:bg-gray-100 px-10 py-4 rounded-xl font-bold text-lg transition-colors">
                        Começar Atendimento Gratuito
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Financie;
