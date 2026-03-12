'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { 
  FileText, Plus, Clock, CheckCircle, 
  Activity, Calendar, ArrowRight 
} from 'lucide-react';

const StatCard = React.memo(({ title, value, icon, color }: any) => (
  <div className="p-6 rounded-3xl border border-[#371851]/10 dark:border-white/10 bg-white dark:bg-white/5 flex items-center gap-4 transition-all">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-bold text-[#371851]/40 dark:text-white/40 uppercase tracking-widest">{title}</p>
      <p className="text-2xl font-black text-[#371851] dark:text-white">{value}</p>
    </div>
  </div>
));
StatCard.displayName = 'StatCard';

const RecentItem = React.memo(({ prescription: p }: { prescription: any }) => (
  <div className="flex items-center gap-4 p-4 rounded-2xl border border-[#371851]/5 dark:border-white/5 bg-white dark:bg-white/5 hover:border-[#18B0C6]/30 transition group">
    <div className="w-10 h-10 rounded-xl bg-[#371851]/5 dark:bg-white/5 flex items-center justify-center font-bold text-[#371851] dark:text-white text-xs">
      {p.patient.user.name.charAt(0)}
    </div>
    <div className="flex-1">
      <p className="text-sm font-bold text-[#371851] dark:text-white">{p.patient.user.name}</p>
      <p className="text-[10px] text-[#371851]/40 dark:text-white/40 uppercase font-mono">{p.code}</p>
    </div>
    <div className="text-right">
      <p className="text-[10px] font-bold text-[#371851]/50 dark:text-white/50">
        {new Date(p.createdAt).toLocaleDateString()}
      </p>
      <Link href={`/doctor/prescriptions/${p.id}`} className="text-[#18B0C6] opacity-0 group-hover:opacity-100 transition-all">
        <ArrowRight size={16} />
      </Link>
    </div>
  </div>
));
RecentItem.displayName = 'RecentItem';

export default function DoctorDashboard() {
  const [data, setData] = useState<{ prescriptions: any[], total: number }>({ prescriptions: [], total: 0 });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const { data: response } = await api.get(`/prescriptions?mine=true&limit=5`);
      setData({ prescriptions: response.data, total: response.total });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const stats = useMemo(() => {
    const pending = data.prescriptions.filter((p: any) => p.status === 'pending').length;
    const consumed = data.prescriptions.filter((p: any) => p.status === 'consumed').length;
    return {
      total: data.total,
      pending,
      consumed
    };
  }, [data.total, data.prescriptions]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#371851] dark:text-white text-balance">¡Buen día, Doctor!</h1>
          <p className="text-[#371851]/50 dark:text-white/50 mt-1">Tu actividad médica centralizada.</p>
        </div>
        <Link
          href="/doctor/prescriptions/new"
          className="flex items-center justify-center gap-2 bg-[#18B0C6] text-white px-6 py-3 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg shadow-[#18B0C6]/20"
        >
          <Plus size={20} />
          Nueva Prescripción
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Emitidas" value={stats.total} icon={<FileText className="text-blue-500" />} color="bg-blue-500/10" />
        <StatCard title="Pendientes" value={stats.pending} icon={<Clock className="text-amber-500" />} color="bg-amber-500/10" />
        <StatCard title="Completadas" value={stats.consumed} icon={<CheckCircle className="text-green-500" />} color="bg-green-500/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="font-black text-[#371851] dark:text-white flex items-center gap-2">
              <Activity size={18} className="text-[#18B0C6]" />
              Actividad Reciente
            </h2>
            <Link href="/doctor/prescriptions" className="text-sm font-bold text-[#18B0C6] hover:underline">Historial completo</Link>
          </div>

          <div className="space-y-3">
            {loading ? (
              [...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-gray-100 dark:bg-white/5 animate-pulse" />)
            ) : (
              data.prescriptions.map((p) => <RecentItem key={p.id} prescription={p} />)
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#371851] rounded-3xl p-6 text-white overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-2 leading-tight">Módulo de Soporte</h3>
              <p className="text-white/70 text-sm mb-4">Central de ayuda RxSystem.</p>
              <button className="bg-white/10 hover:bg-white/20 py-2 px-4 rounded-xl text-xs font-bold transition">Abrir Chat</button>
            </div>
            <FileText size={120} className="absolute -bottom-8 -right-8 text-white/5 rotate-12" />
          </div>
          
          <div className="p-6 rounded-3xl border border-[#371851]/10 dark:border-white/10 bg-white dark:bg-white/5">
            <h3 className="font-black text-[#371851] dark:text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-tighter">
                <Calendar size={16} /> Recordatorios
            </h3>
            <ul className="text-xs space-y-4 text-[#371851]/60 dark:text-white/60">
              <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#18B0C6] mt-1 shrink-0" />Verificar recetas pendientes.</li>
              <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#18B0C6] mt-1 shrink-0" />Actualizar firma digital.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}