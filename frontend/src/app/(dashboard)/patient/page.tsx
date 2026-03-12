'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { 
  Pill, Calendar, Clock, Activity, 
  ArrowRight, Heart, Bell, ShieldCheck, FileText
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// Componente de tarjeta de medicamento (Optimizado con Memo)
const TreatmentCard = React.memo(({ item }: any) => (
  <div className="p-4 rounded-2xl bg-[#371851]/5 dark:bg-white/5 border border-[#371851]/10 dark:border-white/10 flex items-center gap-4">
    <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#1a0c2e] flex items-center justify-center shadow-sm">
      <Pill size={24} className="text-[#18B0C6]" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-bold text-[#371851] dark:text-white truncate">{item.name}</p>
      <p className="text-xs text-[#371851]/50 dark:text-white/50">{item.dosage || 'Dosis no especificada'}</p>
    </div>
    <div className="text-right">
       <span className="text-[10px] font-black uppercase tracking-tighter text-[#18B0C6]">Activo</span>
    </div>
  </div>
));
TreatmentCard.displayName = 'TreatmentCard';

export default function PatientDashboard() {
  const [data, setData] = useState({ prescriptions: [], total: 0 });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      // Ajustamos el endpoint para que coincida con la estructura del backend
      const { data: response } = await api.get(`/prescriptions?limit=3`);
      setData({ prescriptions: response.data, total: response.total });
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      toast.error('Error al sincronizar tu salud');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchDashboardData(); 
  }, [fetchDashboardData]);

  // Extraemos medicamentos de recetas pendientes o activas
  const currentMedicines = useMemo(() => {
    if (!data.prescriptions) return [];
    return data.prescriptions
      .filter((p: any) => p.status === 'pending' || p.status === 'active')
      .flatMap((p: any) => p.items)
      .slice(0, 4);
  }, [data]);

  // Obtenemos el último médico que atendió (llamado 'author' en tu Prisma)
  const lastPrescription = data.prescriptions[0] as any;
  const lastDoctor = lastPrescription?.author;

  return (
    <div className="space-y-8">
      <Toaster position="top-right" />
      
      {/* Saludo y Estado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#371851] dark:text-white">Panel de Bienestar</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <p className="text-sm font-medium text-[#371851]/60 dark:text-white/60">
                Sincronizado con Neon Database
            </p>
          </div>
        </div>
        <div className="flex gap-2">
            <div className="px-4 py-2 rounded-2xl bg-white dark:bg-white/5 border border-[#371851]/10 flex items-center gap-2">
                <Heart size={16} className="text-red-500" />
                <span className="text-sm font-bold">Salud Estable</span>
            </div>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Tratamiento Actual */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="font-black text-[#371851] dark:text-white flex items-center gap-2">
              <Pill size={20} className="text-[#18B0C6]" />
              Mi Tratamiento Actual
            </h2>
            <Link href="/patient/prescriptions" className="text-xs font-bold uppercase tracking-widest text-[#18B0C6]">
                Ver Todas
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-20 rounded-2xl bg-gray-100 dark:bg-white/5 animate-pulse" />
              ))
            ) : currentMedicines.length > 0 ? (
              currentMedicines.map((item: any) => (
                <TreatmentCard key={item.id} item={item} />
              ))
            ) : (
              <div className="col-span-full p-10 rounded-3xl border-2 border-dashed border-[#371851]/10 flex flex-col items-center justify-center text-center">
                <ShieldCheck size={40} className="text-[#371851]/20 mb-2" />
                <p className="text-sm font-bold text-[#371851]/40">No tienes medicamentos activos en este momento</p>
              </div>
            )}
          </div>

          {/* Banner de Recordatorio */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#371851] to-[#5a2a82] text-white shadow-xl relative overflow-hidden">
             <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="font-bold flex items-center gap-2">
                        <Bell size={18} /> Recordatorio importante
                    </h3>
                    <p className="text-white/70 text-sm mt-1">
                        Sigue las dosis indicadas por tu especialista para asegurar la efectividad del tratamiento.
                    </p>
                </div>
                <button className="bg-[#18B0C6] hover:bg-[#159eb2] px-6 py-2 rounded-xl text-sm font-black transition-colors whitespace-nowrap">
                    Entendido
                </button>
             </div>
             <Activity size={100} className="absolute -bottom-10 -left-10 text-white/5" />
          </div>
        </div>

        {/* Columna Derecha: Sidebar de Info */}
        <div className="space-y-6">
          {/* Tarjeta del Médico */}
          <div className="p-6 rounded-3xl border border-[#371851]/10 dark:border-white/10 bg-white dark:bg-white/5">
            <h3 className="text-xs font-black text-[#371851]/40 dark:text-white/40 uppercase tracking-widest mb-4">
                Tu Especialista
            </h3>
            {lastDoctor ? (
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#18B0C6]/20 flex items-center justify-center text-[#18B0C6] font-black">
                        {lastDoctor.user?.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-sm">Dr. {lastDoctor.user?.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                            {lastDoctor.specialty || 'Especialista Registrado'}
                        </p>
                    </div>
                </div>
            ) : (
                <p className="text-xs italic text-muted-foreground">Sin médicos recientes</p>
            )}
            <hr className="my-4 border-[#371851]/5 dark:border-white/5" />
            <Link href="/patient/prescriptions" className="text-xs font-bold text-[#18B0C6] flex items-center gap-2 hover:gap-3 transition-all">
                Historial clínico <ArrowRight size={14} />
            </Link>
          </div>

          {/* Accesos Rápidos */}
          <div className="grid grid-cols-2 gap-3">
             <QuickAction icon={<Calendar size={18} />} label="Citas" />
             <QuickAction icon={<FileText size={18} />} label="Informes" />
          </div>
        </div>

      </div>
    </div>
  );
}

function QuickAction({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <button className="flex flex-col items-center justify-center p-4 rounded-3xl border border-[#371851]/10 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-[#371851]/5 transition-colors gap-2 group">
            <div className="text-[#371851] dark:text-white opacity-60 group-hover:opacity-100 transition-opacity">
                {icon}
            </div>
            <span className="text-xs font-bold text-[#371851] dark:text-white">{label}</span>
        </button>
    )
}