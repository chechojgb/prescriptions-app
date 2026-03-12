import { FileText } from 'lucide-react';
export default function Footer (){
    return(
        <footer className="relative z-10 bg-[#371851] px-10 py-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#18B0C6] flex items-center justify-center">
                <FileText size={13} className="text-white" />
            </div>
            <span className="font-black text-white text-sm">RxSystem</span>
            </div>
            <span className="text-white/30 text-xs">© 2026 RxSystem. Todos los derechos reservados.</span>
        </footer>
    );
}