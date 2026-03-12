import { FileText } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="relative z-10 bg-[#371851] px-6 md:px-10 py-10">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Logo & Brand */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#18B0C6] flex items-center justify-center shadow-lg shadow-[#18B0C6]/20">
                        <FileText size={16} className="text-[#371851]" />
                    </div>
                    <span className="font-black text-white text-base tracking-tight">RxSystem</span>
                </div>

                {/* Copyright */}
                <div className="flex flex-col items-center md:items-end gap-1">
                    <span className="text-white/40 text-xs text-center md:text-right">
                        © 2026 RxSystem. Todos los derechos reservados.
                    </span>
                </div>

            </div>
        </footer>
    );
}