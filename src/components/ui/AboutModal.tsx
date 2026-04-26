import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
    const { language } = useLanguage();

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-md p-6 md:p-8 mx-4 shadow-2xl rounded-sm"
                style={{
                    background: 'linear-gradient(180deg, #f0e8d5 0%, #e4d9bc 100%)',
                    border: '1.5px solid rgba(196,149,42,0.55)',
                    color: '#2c2015',
                }}
                onClick={(e) => e.stopPropagation()} // Prevent clicking inside the modal from closing it
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[#8a6236] hover:text-[#c93c3c] transition-colors text-xl font-bold"
                    title="Close"
                >
                    ✕
                </button>

                <h2 className="text-xl md:text-2xl font-bold mb-4 border-b border-[rgba(196,149,42,0.3)] pb-3 pr-6" style={{ fontFamily: 'var(--font-merriweather, serif)' }}>
                    {language === 'en' ? 'About Biblical Journeys' : 'Sobre Biblical Journeys'}
                </h2>

                <p className="mb-6 text-sm leading-relaxed text-[#4a3623]">
                    {language === 'en'
                        ? 'Welcome to Biblical Journeys, an interactive 3D map designed to help you explore and understand the geographical context of the Bible. Watch the scriptures come to life across ancient terrains.'
                        : 'Bem-vindo ao Biblical Journeys, um mapa 3D interativo projetado para ajudá-lo a explorar e entender o contexto geográfico da Bíblia. Veja as escrituras ganharem vida em terrenos antigos.'}
                </p>

                {/* Contact Card */}
                <div className="bg-[#eaddce] p-5 rounded border border-[rgba(196,149,42,0.4)] shadow-inner mb-6">
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#8a6236] mb-2">
                        {language === 'en' ? 'Developer & Contact' : 'Desenvolvedor e Contato'}
                    </h3>
                    <p className="text-sm text-[#4a3623] mb-3">
                        {language === 'en'
                            ? 'For questions, feedback, or business inquiries, please reach out directly:'
                            : 'Para dúvidas, feedback ou contatos comerciais, entre em contato diretamente:'}
                    </p>

                    {/* Mailto link opens the user's email client automatically */}
                    <a
                        href="mailto:britojoao366@gmail.com"
                        className="inline-flex items-center gap-2 font-bold text-[#c93c3c] hover:text-[#a02c2c] transition-colors underline decoration-1 underline-offset-4"
                        style={{ fontFamily: 'var(--font-merriweather, serif)' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z" />
                        </svg>
                        britojoao366@gmail.com
                    </a>
                </div>

                {/* Legal Credits Section */}
                <div className="text-[10px] leading-relaxed text-[#8a6236]/80 text-center px-4 border-t border-[rgba(196,149,42,0.2)] pt-4 mt-2">
                    {language === 'en'
                        ? 'Historical map textures provided courtesy of the David Rumsey Map Collection, David Rumsey Map Center, Stanford Libraries.'
                        : 'Texturas de mapas históricos fornecidas cortesia da David Rumsey Map Collection, David Rumsey Map Center, Stanford Libraries.'}
                </div>

            </div>
        </div>
    );
}