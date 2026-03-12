'use client';

import React, { useEffect } from 'react';
import { animate, stagger, spring } from 'animejs';
import { CheckCircle, FileText, Lock, Users, BarChart3, Filter, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';

const features = [
  { icon: <FileText size={20} />, label: 'Generación de PDF por prescripción' },
  { icon: <Lock size={20} />, label: 'Autenticación segura con JWT' },
  { icon: <Users size={20} />, label: 'Control de acceso por roles' },
  { icon: <BarChart3 size={20} />, label: 'Métricas y estadísticas en tiempo real' },
  { icon: <Filter size={20} />, label: 'Filtros avanzados y paginación' },
];

const steps = [
  { n: '01', label: 'Crea tu cuenta', desc: 'Registro simple con email y contraseña.' },
  { n: '02', label: 'Accede por rol', desc: 'Médico, paciente o administrador.' },
  { n: '03', label: 'Gestiona al instante', desc: 'Crea, consulta y descarga todo.' },
];

export default function Features() {
  
  useEffect(() => {
    // Animación de entrada para los dos bloques
    animate('.feature-card', {
      opacity: [0, 1],
      x: [-30, 0],
      delay: stagger(100, { start: 200 }),
      ease: spring({ stiffness: 100, damping: 15 })
    });

    animate('.step-card', {
      opacity: [0, 1],
      scale: [0.9, 1],
      delay: stagger(150, { start: 500 }),
      ease: 'out(3)'
    });
  }, []);

  return (
    <section id="features" className="py-24 px-6 bg-white dark:bg-[#0a0510] relative overflow-hidden">
      {/* Glow decorativo de fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#371851]/5 dark:bg-[#371851]/10 blur-[120px] rounded-full -z-10" />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* --- Columna Izquierda: Features (Morado Elegante) --- */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 text-[#18B0C6] text-xs font-black uppercase tracking-[0.3em]">
                <Zap size={14} fill="#18B0C6" /> Potencial
              </span>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-[#371851] dark:text-white leading-[0.95]">
                Todo lo que <br /> <span className="text-[#18B0C6]">necesitas.</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg max-w-md leading-relaxed">
                Herramientas diseñadas para simplificar la gestión médica sin complicaciones técnicas.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f) => (
                <div
                  key={f.label}
                  className="feature-card flex items-center gap-4 bg-slate-50 dark:bg-[#1a0c26] p-5 rounded-[2rem] border border-slate-100 dark:border-white/5 hover:border-[#18B0C6]/40 transition-all group shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#371851] text-[#18B0C6] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    {f.icon}
                  </div>
                  <span className="text-slate-700 dark:text-slate-200 text-sm font-bold leading-tight tracking-tight">
                    {f.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* --- Columna Derecha: Pasos (Acento Turquesa Dinámico) --- */}
          <div className="lg:col-span-5 relative">
            <div className="bg-[#371851] p-10 md:p-12 rounded-[3.5rem] relative overflow-hidden shadow-2xl shadow-purple-900/20">
              {/* Glow interno */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#18B0C6]/20 blur-3xl rounded-full" />
              
              <div className="relative z-10 space-y-8">
                <div>
                  <span className="text-[#18B0C6] text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Onboarding</span>
                  <h3 className="text-3xl font-black text-white mt-2 tracking-tighter">3 Pasos Simples</h3>
                </div>

                <div className="space-y-4">
                  {steps.map((step, i) => (
                    <div
                      key={step.n}
                      className="step-card flex items-start gap-5 bg-white/5 p-6 rounded-[2.5rem] border border-white/5 hover:bg-white/10 transition-colors group"
                    >
                      <span className="text-3xl font-black text-[#18B0C6]/40 leading-none group-hover:text-[#18B0C6] transition-colors">
                        {step.n}
                      </span>
                      <div>
                        <p className="text-white font-bold text-lg mb-1 tracking-tight">{step.label}</p>
                        <p className="text-white/40 text-xs leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/login"
                  className="flex items-center justify-between w-full bg-[#18B0C6] hover:bg-[#1498ab] text-[#371851] font-black py-5 px-8 rounded-3xl transition-all group shadow-lg shadow-cyan-500/20"
                >
                  Empezar ahora
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}