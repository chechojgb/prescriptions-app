import Link from "next/link";
import { Shield, Lock, ArrowRight } from 'lucide-react';

export default function Security() {
  return (
    <section className="relative z-10 px-4 md:px-6 py-16 max-w-6xl mx-auto">
      <div className="bg-[#371851]/5 dark:bg-white/5 border border-[#371851]/10 dark:border-white/10 rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
        
        {/* Icono */}
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[#371851] dark:bg-[#18B0C6]/20 flex items-center justify-center shrink-0">
          <Shield size={26} className="text-[#18B0C6]" />
        </div>

        {/* Texto */}
        <div className="flex-1">
          <h3 className="font-black text-lg md:text-xl mb-2">Seguridad de nivel clínico</h3>
          <p className="text-[#371851]/60 dark:text-white/60 text-sm leading-relaxed max-w-xl">
            Protegemos tus datos de punta a punta. Acceso controlado por roles, contraseñas cifradas y sesiones seguras para que tu información médica esté siempre a salvo.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {[
              { icon: <Lock size={11} />, label: 'Cifrado extremo a extremo' },
              { icon: <Shield size={11} />, label: 'Acceso por roles' },
              { icon: <Lock size={11} />, label: 'Sesiones seguras' },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#371851]/10 dark:bg-white/10 border border-[#371851]/10 dark:border-white/10">
                <span className="text-[#18B0C6]">{badge.icon}</span>
                <span className="text-[10px] font-bold text-[#371851]/70 dark:text-white/70">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Botón */}
        <Link
          href="/login"
          className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2 bg-[#371851] dark:bg-[#18B0C6] text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition"
        >
          Entrar <ArrowRight size={16} />
        </Link>

      </div>
    </section>
  );
}