import React, { useState } from 'react';
import {
    User,
    Phone,
    Mail,
    Home,
    MapPin,
    DollarSign,
    FileText,
    CheckCircle,
    ShieldCheck,
    Zap,
    Star,
    Scale,
    Maximize,
    Layout,
    Check,
    Plus,
    ChevronDown
} from 'lucide-react';
import Button from '../components/ui/Button';
import LgpdConsentCheckbox from '../components/ui/LgpdConsentCheckbox';
import useSEO from '../hooks/useSEO';
import { db } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// ID do documento da imobiliária em /imobiliarias/ no Firestore
// Configurado por deploy em .env — nunca editável pelo visitante
const SUBDOMAIN = import.meta.env.VITE_SUBDOMAIN;

/**
 * SEGURANÇA (auditoria):
 * -----------------------------------------------------------------------
 * 1) Nunca gravamos `{...formData}` diretamente no Firestore. Construímos
 *    um payload explícito (ALLOWED FIELDS) para que nenhum campo futuro
 *    adicionado ao estado do formulário vaze para o banco sem revisão
 *    consciente, e para que nada além do esperado seja aceito.
 * 2) Limites de tamanho são aplicados tanto via `maxLength` no HTML quanto
 *    via validação em JS antes do envio — mas isso é só a primeira camada.
 *    A camada que realmente protege contra abuso é a Firestore Security
 *    Rule (`firestore.rules`), que deve validar tipos, tamanhos e a lista
 *    de campos permitidos no servidor, pois o client-side é sempre
 *    contornável (alguém pode chamar a API do Firestore diretamente).
 * 3) Honeypot simples (`website`) para reduzir spam automatizado sem
 *    exigir CAPTCHA. Bots preenchem todos os inputs de um form; um campo
 *    invisível para humanos e SEM label acessível costuma pegar a maioria
 *    dos bots simples. Isso não substitui o Firebase App Check.
 * -----------------------------------------------------------------------
 */

const FIELD_LIMITS = {
    name: 120,
    cellphone_number: 30,
    email: 150,
    zip_code: 10,
    uf: 2,
    city: 120,
    neighborhood_id: 120,
    street_address: 200,
    street_number: 20,
    street_complement: 120,
    description: 3000,
    price: 40,
    condominium_price: 40,
    territorial_tax_price: 40,
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialFormData = {
    name: '',
    cellphone_number: '',
    email: '',
    transaction: 'Vender',
    profile: 'Residencial',
    subtype_id: '',
    zip_code: '',
    uf: '',
    city: '',
    neighborhood_id: '',
    street_address: '',
    street_number: '',
    street_complement: '',
    // Medidas
    built_area: '',
    private_area: '',
    total_area: '',
    // Cômodos
    bedroom: '',
    suite: '',
    bathroom: '',
    garage: '',
    is_covered: false,
    has_box_in_garage: false,
    tvroom: '',
    diningroom: '',
    livingroom: '',
    washbasin: '',
    service_area: '',
    kitchen: '',
    closet: '',
    office: '',
    employeeDependency: '',
    pantry: '',
    // Multi-selects
    characteristics: [],
    establishments: [],
    // Financeiro
    price: '',
    condominium_price: '',
    territorial_tax_price: '',
    description: '',
    autorization: false,
    check: false,
    // Honeypot — nunca preenchido por um humano; não é enviado ao Firestore
    website: '',
};

// Lista explícita do que é gravado no Firestore. Qualquer campo novo
// adicionado ao estado do formulário no futuro precisa ser adicionado aqui
// conscientemente antes de ser persistido — evita vazamento acidental de
// campos internos (ex.: um futuro `internalNotes`, `adminFlag`, etc.).
const ALLOWED_FIELDS = [
    'name', 'cellphone_number', 'email', 'transaction', 'profile', 'subtype_id',
    'zip_code', 'uf', 'city', 'neighborhood_id', 'street_address', 'street_number',
    'street_complement', 'built_area', 'private_area', 'total_area', 'bedroom',
    'suite', 'bathroom', 'garage', 'is_covered', 'has_box_in_garage', 'tvroom',
    'diningroom', 'livingroom', 'washbasin', 'service_area', 'kitchen', 'closet',
    'office', 'employeeDependency', 'pantry', 'characteristics', 'establishments',
    'price', 'condominium_price', 'territorial_tax_price', 'description',
    'autorization', 'check',
];

function buildLeadPayload(formData) {
    const payload = {};
    for (const key of ALLOWED_FIELDS) {
        const value = formData[key];
        if (typeof value === 'string') {
            payload[key] = value.trim().slice(0, FIELD_LIMITS[key] || 500);
        } else {
            payload[key] = value;
        }
    }
    return payload;
}

function validateLead(formData) {
    if (!formData.name.trim()) return 'Informe seu nome.';
    if (!formData.email.trim() || !EMAIL_REGEX.test(formData.email.trim())) return 'Informe um e-mail válido.';
    if (!formData.cellphone_number.trim()) return 'Informe um telefone para contato.';
    if (formData.description.length > FIELD_LIMITS.description) return 'A descrição está muito longa.';
    if (!formData.autorization) return 'É necessário autorizar a intermediação do imóvel.';
    return null;
}

const Negocie = () => {
    useSEO('Negocie seu Imóvel', 'Anuncie seu imóvel conosco. Avaliação técnica precisa e atendimento especializado para vender ou alugar.');
    const [formData, setFormData] = useState(initialFormData);

    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const propertySubtypes = [
        { label: "Apartamento", options: ["Alto Padrão", "Cobertura", "Cobertura Duplex", "Cobertura Linear", "Cobertura Triplex", "Com área externa", "Conjugado", "Duplex", "Flat", "Garden", "Kitnet", "Loft", "Padrão", "Penthouse", "Studio", "Triplex", "Térreo"] },
        { label: "Casa", options: ["Alto Padrão", "Alvenaria", "Chalé", "Duplex", "Geminada", "Geminada Triplex", "Kitnet", "Linear", "Madeira", "Mista", "Padrão", "Pré-moldada", "Sobrado", "Sobreloja", "Sobreposta", "Triplex", "Térrea", "Vila", "em Condomínio"] },
        { label: "Terreno", options: ["Lote", "Terreno", "em Condomínio", "em Loteamento"] },
        { label: "Sítio", options: ["Haras", "Sítio"] },
        { label: "Garagem", options: ["Box", "Garagem externa", "Garagem externa coberta", "Garagem interna"] },
        { label: "Fazenda", options: ["Fazenda", "Haras", "Lavoura", "Mista", "Pecuária"] },
        { label: "Chácara", options: ["Chácara"] },
        { label: "Rancho", options: ["Rancho"] },
        { label: "Pousada", options: ["Pousada"] },
        { label: "Sala", options: ["Andar Comercial", "Comercial", "Loja"] },
        { label: "Loja", options: ["Loja", "Ponto Comercial"] },
        { label: "Flat", options: ["Flat"] },
        { label: "Sobrado", options: ["Alto Padrão", "Geminado", "Padrão", "em Condomínio"] },
        { label: "Prédio", options: ["Comercial", "Residencial"] },
        { label: "Indústria", options: ["Indústria", "Pavilhão/Galpão", "Em condomínio", "Industrial", "Logístico", "Salão Comercial"] },
        { label: "Área", options: ["Comercial", "Industrial", "Reflorestamento", "Residencial", "Residencial/Comercial", "Rural"] },
        { label: "Ponto Comercial", options: ["Ponto Comercial"] },
        { label: "Andar Comercial", options: ["Comércio", "Indústria"] },
        { label: "Sala comercial", options: ["Andar Comercial", "Duplex", "Em edifício", "Nível de rua", "Sobreposta", "Térreo"] },
        { label: "Ilha", options: ["Arquipélago", "Fluvial", "Lacustre", "Marítima"] },
        { label: "Hotel", options: ["Hotel", "Unidade"] },
        { label: "Loteamento", options: ["Completo"] },
        { label: "Salão comercial", options: ["Salão comercial"] },
        { label: "Haras", options: ["Esportivo", "Familiar", "Profissional", "Recreativo"] }
    ];

    const characteristicsList = [
        "Aquecimento a gás", "Gás central", "Aquecimento central", "Ar condicionado central",
        "Deck Molhado", "Depósito", "Espaço verde", "Gás individual", "Calefação",
        "Circuito de segurança", "Forro de PVC", "Forro de gesso", "Hidromassagem",
        "Forro de madeira", "Área esportiva", "Internet", "Hidrômetro individual",
        "Interfone", "Isolamento acústico", "Cabeamento estruturado", "Vista exterior",
        "Vista para a montanha", "Vista para o lago", "Gerador elétrico", "Biblioteca",
        "Cozinha americana", "Cozinha gourmet", "Portaria", "Vigia", "Sistema de alarme",
        "Fechadura digital", "Energia solar", "Espaço Pet", "Banheira", "Rua asfaltada",
        "Ronda/Vigilância", "Sacada", "Churrasqueira", "Semimobiliado", "Elevador",
        "Salão de festas", "Estacionamento", "Academia", "Jardim", "Piscina", "Playground",
        "Mobiliado", "Varanda", "Aquecimento solar", "Lareira", "Mezanino", "Sauna",
        "Zelador", "Armário na cozinha", "Acessibilidade", "Adega", "Forro rebaixado",
        "Lavanderia", "SPA", "Espera para ar-condicionado", "Forro em gesso",
        "Home office", "Varanda gourmet", "Cozinha independente"
    ];

    const establishmentsList = [
        "Banco", "Escola", "Escola de idioma", "Faculdade", "Farmácia", "Hospital",
        "Igreja", "Padaria", "Praça", "Shopping", "Supermercado", "Rodovia", "Transporte público"
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleToggle = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMultiSelect = (name, item) => {
        setFormData(prev => {
            const currentList = prev[name];
            if (currentList.includes(item)) {
                return { ...prev, [name]: currentList.filter(i => i !== item) };
            } else {
                return { ...prev, [name]: [...currentList, item] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null);

        // Honeypot: campo invisível para humanos. Se veio preenchido, é bot.
        // Falhamos silenciosamente (sem revelar ao bot que foi detectado).
        if (formData.website) {
            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const validationError = validateLead(formData);
        if (validationError) {
            setSubmitError(validationError);
            return;
        }

        if (!SUBDOMAIN) {
            setSubmitError('Configuração da imobiliária ausente. Contate o suporte.');
            return;
        }

        setSubmitting(true);
        try {
            const payload = buildLeadPayload(formData);
            await addDoc(collection(db, 'imobiliarias', SUBDOMAIN, 'imoveis_negociar'), {
                ...payload,
                createdAt: serverTimestamp(),
            });
            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error('Erro ao enviar para o Firebase:', err);
            setSubmitError('Não foi possível enviar suas informações. Tente novamente em instantes.');
        } finally {
            setSubmitting(false);
        }
    };

    const benefits = [
        {
            icon: <Scale className="h-6 w-6 text-primary" />,
            title: "Assessoria Jurídica",
            description: "Acompanhamento jurídico e operacional de qualidade para uma transação segura."
        },
        {
            icon: <ShieldCheck className="h-6 w-6 text-primary" />,
            title: "Transparência Total",
            description: "Ética profissional e clareza em todas as etapas do processo de negociação."
        },
        {
            icon: <Star className="h-6 w-6 text-primary" />,
            title: "Atendimento Personalizado",
            description: "Corretores especializados focados na sua segurança e satisfação total."
        },
        {
            icon: <Zap className="h-6 w-6 text-primary" />,
            title: "Eficiência Garantida",
            description: "Profissionais capacitados para máxima agilidade nas intermediações imobiliárias."
        }
    ];

    if (submitted) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                        <CheckCircle size={48} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Informações Recebidas!</h2>
                    <p className="text-gray-600 mb-8">
                        Obrigado por detalhar seu imóvel. Nossa equipe analisará cuidadosamente cada característica e entrará em contato em breve para os próximos passos.
                    </p>
                    <Button onClick={() => { setFormData(initialFormData); setSubmitted(false); }} className="w-full">
                        Voltar ao formulário
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Hero Section */}
            <section className="relative py-20 bg-primary text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1582408921715-18e7806365c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Negocie seu Imóvel</h1>
                    <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
                        Valorizamos cada detalhe do seu patrimônio. Complete o formulário para uma avaliação técnica precisa e atendimento especializado.
                    </p>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16 container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                                {benefit.icon}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                            <p className="text-gray-600 text-sm">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Form Section */}
            <section className="container mx-auto px-4 max-w-5xl">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12">

                        {/* Honeypot — mantido fora da vista humana via CSS, nunca com display:none
                            (alguns bots ignoram display:none) e sem "type=hidden" (idem). Não possui
                            label associado nem é alcançável por Tab (tabIndex=-1), então usuários
                            reais nunca interagem com ele. */}
                        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }} aria-hidden="true">
                            <input
                                type="text"
                                name="website"
                                tabIndex={-1}
                                autoComplete="off"
                                value={formData.website}
                                onChange={handleChange}
                            />
                        </div>

                        {/* 1. Seus Dados */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                    <User size={20} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Seus dados</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Nome Completo</label>
                                    <input type="text" name="name" required maxLength={FIELD_LIMITS.name} placeholder="Seu nome" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none" value={formData.name} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Telefone / WhatsApp</label>
                                    <input type="tel" name="cellphone_number" required maxLength={FIELD_LIMITS.cellphone_number} placeholder="(00) 00000-0000" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none" value={formData.cellphone_number} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">E-mail</label>
                                    <input type="email" name="email" required maxLength={FIELD_LIMITS.email} placeholder="seu@email.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none" value={formData.email} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* 2. Tipo e Transação */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
                            <div className="space-y-4">
                                <p className="text-sm font-bold text-gray-900 uppercase tracking-wider">Você gostaria de:</p>
                                <div className="flex p-1 bg-gray-50 border border-gray-100 rounded-2xl">
                                    {['Vender', 'Alugar', 'Temporada'].map(t => (
                                        <button key={t} type="button" className={`flex-1 py-3 rounded-xl font-bold transition-all ${formData.transaction === t ? 'bg-white shadow-md text-primary ring-1 ring-gray-100' : 'text-gray-400'}`} onClick={() => handleToggle('transaction', t)}>{t}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-sm font-bold text-gray-900 uppercase tracking-wider">Perfil do imóvel:</p>
                                <div className="flex p-1 bg-gray-50 border border-gray-100 rounded-2xl">
                                    {['Residencial', 'Comercial'].map(p => (
                                        <button key={p} type="button" className={`flex-1 py-3 rounded-xl font-bold transition-all ${formData.profile === p ? 'bg-white shadow-md text-primary ring-1 ring-gray-100' : 'text-gray-400'}`} onClick={() => handleToggle('profile', p)}>{p}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Tipo do imóvel</label>
                                <div className="relative">
                                    <select
                                        name="subtype_id"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none bg-white font-medium appearance-none cursor-pointer pr-10"
                                        value={formData.subtype_id}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>Selecione uma opção</option>
                                        {propertySubtypes.map((group) => (
                                            <optgroup key={group.label} label={group.label}>
                                                {group.options.map(option => (
                                                    <option key={`${group.label}-${option}`} value={`${group.label} - ${option}`}>
                                                        {group.label} - {option}
                                                    </option>
                                                ))}
                                            </optgroup>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                </div>
                            </div>
                        </div>

                        {/* 3. Localização */}
                        <div className="space-y-6 pt-4">
                            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                    <MapPin size={20} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Onde fica o imóvel?</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">CEP</label>
                                    <input type="text" name="zip_code" required maxLength={FIELD_LIMITS.zip_code} placeholder="00000-000" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" value={formData.zip_code} onChange={handleChange} />
                                </div>
                                <div className="md:col-span-1 space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">UF</label>
                                    <input type="text" name="uf" required placeholder="UF" maxLength={FIELD_LIMITS.uf} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none uppercase" value={formData.uf} onChange={handleChange} />
                                </div>
                                <div className="md:col-span-3 space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Cidade</label>
                                    <input type="text" name="city" required maxLength={FIELD_LIMITS.city} placeholder="Cidade" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" value={formData.city} onChange={handleChange} />
                                </div>
                                <div className="md:col-span-3 space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Bairro</label>
                                    <input type="text" name="neighborhood_id" required maxLength={FIELD_LIMITS.neighborhood_id} placeholder="Bairro" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" value={formData.neighborhood_id} onChange={handleChange} />
                                </div>
                                <div className="md:col-span-3 space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Endereço</label>
                                    <input type="text" name="street_address" required maxLength={FIELD_LIMITS.street_address} placeholder="Rua, Avenida, etc" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" value={formData.street_address} onChange={handleChange} />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Número</label>
                                    <input type="text" name="street_number" required maxLength={FIELD_LIMITS.street_number} placeholder="0" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" value={formData.street_number} onChange={handleChange} />
                                </div>
                                <div className="md:col-span-4 space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Complemento</label>
                                    <input type="text" name="street_complement" maxLength={FIELD_LIMITS.street_complement} placeholder="Apto, Bloco, etc" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" value={formData.street_complement} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* 4. Medidas */}
                        <div className="space-y-6 pt-4">
                            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                    <Maximize size={20} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Medidas</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { name: 'built_area', label: 'Área Construída (m²)' },
                                    { name: 'private_area', label: 'Área Privativa (m²)' },
                                    { name: 'total_area', label: 'Área Total (m²)' }
                                ].map(field => (
                                    <div key={field.name} className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">{field.label}</label>
                                        <input type="text" name={field.name} maxLength={20} placeholder="0" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" value={formData[field.name]} onChange={handleChange} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 5. Cômodos */}
                        <div className="space-y-6 pt-4">
                            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                    <Layout size={20} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Cômodos</h2>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {[
                                    { name: 'bedroom', label: 'Dormitório' },
                                    { name: 'suite', label: 'Sendo suíte' },
                                    { name: 'bathroom', label: 'Banheiro' },
                                    { name: 'garage', label: 'Garagem' },
                                    { name: 'tvroom', label: 'Sala de TV' },
                                    { name: 'diningroom', label: 'Sala de jantar' },
                                    { name: 'livingroom', label: 'Sala de estar' },
                                    { name: 'washbasin', label: 'Lavabo' },
                                    { name: 'service_area', label: 'Área de serviço' },
                                    { name: 'kitchen', label: 'Cozinha' },
                                    { name: 'closet', label: 'Closet' },
                                    { name: 'office', label: 'Escritório' },
                                    { name: 'employeeDependency', label: 'Dep. Serviço' },
                                    { name: 'pantry', label: 'Copa' }
                                ].map(item => (
                                    <div key={item.name} className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">{item.label}</label>
                                        <input type="text" name={item.name} maxLength={10} placeholder="0" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none text-center" value={formData[item.name]} onChange={handleChange} />
                                    </div>
                                ))}
                            </div>

                            {/* Opções de Garagem */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-gray-700">Garagem coberta?</span>
                                    <div className="flex gap-2">
                                        {[true, false].map(v => (
                                            <button key={v.toString()} type="button" className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${formData.is_covered === v ? 'bg-primary text-white' : 'bg-white text-gray-400'}`} onClick={() => handleToggle('is_covered', v)}>{v ? 'Sim' : 'Não'}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-gray-700">Possui box na garagem?</span>
                                    <div className="flex gap-2">
                                        {[true, false].map(v => (
                                            <button key={v.toString()} type="button" className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${formData.has_box_in_garage === v ? 'bg-primary text-white' : 'bg-white text-gray-400'}`} onClick={() => handleToggle('has_box_in_garage', v)}>{v ? 'Sim' : 'Não'}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 6. Características */}
                        <div className="space-y-6 pt-4">
                            <div className="border-b border-gray-100 pb-4">
                                <h2 className="text-2xl font-bold text-gray-900">Características</h2>
                                <p className="text-sm text-gray-500 mt-1">Selecione o que o seu imóvel oferece:</p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {characteristicsList.map(item => (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() => handleMultiSelect('characteristics', item)}
                                        className={`flex items-center gap-2 p-3 rounded-xl text-left text-xs font-semibold transition-all border ${formData.characteristics.includes(item) ? 'bg-primary/5 border-primary text-primary' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'}`}
                                    >
                                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${formData.characteristics.includes(item) ? 'bg-primary border-primary text-white' : 'bg-white border-gray-200'}`}>
                                            {formData.characteristics.includes(item) ? <Check size={10} strokeWidth={4} /> : <Plus size={10} />}
                                        </div>
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 7. Estabelecimentos */}
                        <div className="space-y-6 pt-4">
                            <div className="border-b border-gray-100 pb-4">
                                <h2 className="text-2xl font-bold text-gray-900">O que tem por perto?</h2>
                                <p className="text-sm text-gray-500 mt-1">Pontos de interesse próximos ao imóvel:</p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {establishmentsList.map(item => (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() => handleMultiSelect('establishments', item)}
                                        className={`flex items-center gap-2 p-3 rounded-xl text-left text-xs font-semibold transition-all border ${formData.establishments.includes(item) ? 'bg-primary/5 border-primary text-primary' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'}`}
                                    >
                                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${formData.establishments.includes(item) ? 'bg-primary border-primary text-white' : 'bg-white border-gray-200'}`}>
                                            {formData.establishments.includes(item) ? <Check size={10} strokeWidth={4} /> : <Plus size={10} />}
                                        </div>
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 8. Financeiro */}
                        <div className="space-y-6 pt-4">
                            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                    <DollarSign size={20} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Dados financeiros</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Preço do imóvel</label>
                                    <input type="text" name="price" required maxLength={FIELD_LIMITS.price} placeholder="R$ 0,00" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-bold text-primary" value={formData.price} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Condomínio (Mensal)</label>
                                    <input type="text" name="condominium_price" maxLength={FIELD_LIMITS.condominium_price} placeholder="R$ 0,00" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" value={formData.condominium_price} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">IPTU (Anual)</label>
                                    <input type="text" name="territorial_tax_price" maxLength={FIELD_LIMITS.territorial_tax_price} placeholder="R$ 0,00" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" value={formData.territorial_tax_price} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* 9. Descrição */}
                        <div className="space-y-4 pt-4">
                            <label className="text-sm font-bold text-gray-900 uppercase tracking-wider">Descreva seu imóvel</label>
                            <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <strong>Dica:</strong> Informe dados para ajudar a valorizar o anúncio, como situação do imóvel, pontos fortes do bairro, vizinhança, ventilação, iluminação, etc.
                            </p>
                            <textarea name="description" rows="5" maxLength={FIELD_LIMITS.description} placeholder="Digite aqui..." className="w-full px-4 py-4 rounded-xl border border-gray-200 outline-none resize-none leading-relaxed" value={formData.description} onChange={handleChange}></textarea>
                            <p className="text-xs text-gray-400 text-right">{formData.description.length}/{FIELD_LIMITS.description}</p>
                        </div>

                        {/* Final Consents */}
                        <div className="space-y-5 pt-4">
                            <label className="flex items-start gap-4 cursor-pointer group">
                                <input type="checkbox" name="autorization" required className="w-5 h-5 rounded border-gray-300 text-primary mt-1" checked={formData.autorization} onChange={handleChange} />
                                <span className="text-sm text-gray-600 leading-relaxed">Autorizo a <strong>INTERMEDIAÇÃO</strong> deste imóvel de minha propriedade.</span>
                            </label>

                            {/*
                              Checkbox de concordância com a Política de Privacidade.
                              Renderiza (e exige marcação) somente se a imobiliária
                              tiver privacyConsentRequired ativado nas configurações
                              de LGPD — controlado 100% pelo painel, sem hardcode.
                            */}
                            <LgpdConsentCheckbox checked={formData.check} onChange={handleChange} />

                            {submitError && (
                                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-4">{submitError}</p>
                            )}
                            <Button type="submit" disabled={submitting} className="w-full py-5 text-xl font-bold shadow-2xl shadow-primary/30 hover:scale-[1.01] transition-transform disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100">
                                {submitting ? 'Enviando...' : 'Enviar Informações'}
                            </Button>
                        </div>
                    </form>
                </div>
            </section>

            <style dangerouslySetInnerHTML={{
                __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        
        optgroup {
          font-weight: 700;
          color: var(--primary);
          padding: 8px;
          background: #f8fafc;
        }
        option {
          font-weight: 500;
          color: #475569;
          padding: 4px 12px;
          background: white;
        }
      `}} />
        </div>
    );
};

export default Negocie;