import Link from "next/link";
import { ModeToggle } from '@/components/mode-toggle';
import { Stethoscope} from 'lucide-react';

export default function Navbar () {
    return(
        <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl">
        <div className="bg-white/70 dark:bg-[#1a0c2e]/70 backdrop-blur-xl border border-[#371851]/10 dark:border-white/10 px-6 py-3 rounded-2xl flex items-center justify-between shadow-xl shadow-[#371851]/5">
          <div className="nav-item flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#371851] flex items-center justify-center">
              <Stethoscope size={16} className="text-white" />
            </div>
            <span className="font-black text-lg tracking-tight">RxSystem</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#371851]/50 dark:text-white/50">
            <a className="nav-item hover:text-[#371851] dark:hover:text-white transition" href="#roles">Roles</a>
            <a className="nav-item hover:text-[#371851] dark:hover:text-white transition" href="#features">Funciones</a>
          </div>

          <div className="flex items-center gap-3">
            <div className="nav-item"><ModeToggle /></div>
            <div className="nav-item">
              <Link href="/login" className="bg-[#371851] text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-[#18B0C6] transition-colors">
                Ingresar
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
}