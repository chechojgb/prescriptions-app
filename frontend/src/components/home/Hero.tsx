"use client";

import React, { useEffect } from 'react';
import { animate, stagger, spring, cubicBezier } from 'animejs';
import { ArrowRight, Activity, Zap, CheckCircle2, FileText, Pill } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  
  useEffect(() => {
    animate('.hero-content-animate', {
      opacity: [0, 1],
      x: [-40, 0],
      delay: stagger(150),
      ease: cubicBezier(0.2, 1, 0.3, 1),
      duration: 1000
    });

    animate('.hero-panel-animate', {
      opacity: [0, 1],
      scale: [0.9, 1],
      y: [30, 0],
      delay: 600,
      ease: spring({ stiffness: 100, damping: 15, bounce: 0.3 })
    });

    animate('.stat-row', {
      opacity: [0, 1],
      x: [20, 0],
      delay: stagger(100, { start: 1000 }),
      ease: 'out(3)'
    });
  }, []);

  return (
    <section className="relative z-10 pt-32 md:pt-44 pb-16 md:pb-24 px-4 md:px-6 max-w-6xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        
        {/* Lado Izquierdo — Texto */}
        <div className="space-y-6 md:space-y-8 text-center md:text-left">
          <div className="hero-content-animate inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#371851]/5 dark:bg-white/5 border border-[#371851]/10 dark:border-white/10 shadow-sm">
            <Zap size={14} className="text-[#18B0C6]" fill="#18B0C6" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#371851]/60 dark:text-white/60">
              RxSystem Intelligent Core
            </span>
          </div>

          <h1 className="hero-content-animate text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter text-[#371851] dark:text-white">
            Prescribe.<br />
            <span className="text-[#18B0C6]">Conecta.</span><br />
            Evoluciona.
          </h1>

          <p className="hero-content-animate text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-md mx-auto md:mx-0 leading-relaxed font-medium">
            Gestión de prescripciones con seguridad de nivel clínico y una interfaz diseñada para la fluidez profesional.
          </p>

          <div className="hero-content-animate flex items-center gap-4 flex-wrap justify-center md:justify-start">
            <Link href="/login" className="inline-flex items-center gap-3 bg-[#371851] text-white px-8 md:px-10 py-4 md:py-5 rounded-[2rem] font-bold text-base md:text-lg hover:shadow-[0_20px_40px_rgba(55,24,81,0.25)] hover:scale-105 transition-all active:scale-95">
              Comenzar ahora <ArrowRight size={20} />
            </Link>
            <a href="#features" className="inline-flex items-center gap-2 border border-slate-200 dark:border-white/10 px-8 md:px-10 py-4 md:py-5 rounded-[2.5rem] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
              Saber más
            </a>
          </div>
        </div>

         {/* Lado Derecho — Preview Prescripción */}
        <div className="hero-panel-animate relative group">
            {/* Glow decorativo externo */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#18B0C6]/15 blur-3xl rounded-full" />
            
            <div className="bg-[#371851] rounded-[3.5rem] p-12 relative overflow-hidden shadow-2xl shadow-purple-900/40 border border-white/5">
                {/* Fondo decorativo interno */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#18B0C6]/10 blur-[100px] rounded-full" />

                {/* Indicador de Conectividad Clínica */}
                <div className="relative z-10 flex items-center gap-4 mb-14">
                <div className="relative">
                    <div className="w-14 h-14 rounded-[1.25rem] bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                    <Activity className="text-[#18B0C6]" size={28} />
                    </div>
                    {/* El puntito de "Sistema Activo" */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#18B0C6] border-4 border-[#371851] rounded-full shadow-[0_0_10px_#18B0C6]" />
                </div>
                <div>
                    <h4 className="text-white font-black text-xl tracking-tight leading-none">Canal Seguro</h4>
                    <p className="text-white/30 text-[10px] uppercase tracking-[0.25em] mt-2 font-bold">Protección de Datos Activa</p>
                </div>
                </div>

                {/* Monitor de Flujo de Trabajo (Minimalista) */}
                <div className="relative z-10 space-y-8 mb-14">
                {/* Barra 1: Eficiencia operativa */}
                <div className="space-y-3">
                    <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Optimización de consulta</span>
                    <span className="text-[#18B0C6] font-black text-sm tracking-tighter">Flux 95%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-[95%] h-full bg-gradient-to-r from-[#18B0C6] to-[#1498ab] rounded-full shadow-[0_0_15px_rgba(24,176,198,0.3)]" />
                    </div>
                </div>
                
                {/* Barra 2: Disponibilidad */}
                <div className="space-y-3">
                    <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Disponibilidad del Servicio</span>
                    <span className="text-white/80 font-black text-sm tracking-tighter">99.9%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-white/20 rounded-full" />
                    </div>
                </div>
                </div>

                {/* Tarjeta Flotante de Acción (Estilo Glassmorphism Pro) */}
                <div className="relative z-10 p-6 bg-white/5 rounded-[2.25rem] border border-white/10 flex items-center justify-between group/action cursor-pointer hover:bg-white/10 transition-all active:scale-95 shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#18B0C6] flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <Zap size={20} className="text-[#371851]" fill="#371851" />
                    </div>
                    <div>
                    <span className="text-white font-bold text-sm block leading-none">Acceso Médico</span>
                    <span className="text-white/30 text-[10px] font-medium">Click para entrar</span>
                    </div>
                </div>
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover/action:border-[#18B0C6] transition-colors">
                    <ArrowRight size={14} className="text-white/20 group-hover/action:text-[#18B0C6] group-hover/action:translate-x-0.5 transition-all" />
                </div>
                </div>

                {/* Detalle decorativo al final */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/10 rounded-full" />
            </div>
            </div>

      </div>
    </section>
  );
}