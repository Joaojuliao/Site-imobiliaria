import React from 'react';
import { Home, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-50 border-t mt-auto">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-bold text-xl">
                            <Home className="h-6 w-6" />
                            <span>Imobi</span>
                        </div>
                        <p className="text-sm text-gray-500">
                            A maneira mais fácil de encontrar seu novo lar. Dados atualizados em tempo real diretamente do Google Sheets.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Navegação</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><a href="/" className="hover:text-primary">Início</a></li>
                            <li><a href="#" className="hover:text-primary">Destaques</a></li>
                            <li><a href="/imoveis" className="hover:text-primary">Todos os Imóveis</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Contato</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li>contato@imobi.com</li>
                            <li>(11) 99999-9999</li>
                            <li>Av. Paulista, 1000 - SP</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Redes Sociais</h3>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-400 hover:text-primary">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary">
                                <Twitter className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t mt-12 pt-8 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} Imobi. Todos os direitos reservados.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
