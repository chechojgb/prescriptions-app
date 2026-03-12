'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { FileText, Users, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

interface Metrics {
  totals: {
    doctors: number;
    patients: number;
    prescriptions: number;
  };
  byStatus: {
    pending: number;
    consumed: number;
  };
  byDay: { date: string; count: number }[];
  topDoctors: { doctorId: string; doctorName: string; count: number }[];
}


const COLORS = ['#371851', '#18B0C6'];

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);



  

  useEffect(() => {
    fetchMetrics();
  }, []);

  async function fetchMetrics() {
    try {
      const { data } = await api.get('/admin/metrics');
      console.log('METRICS:', data);
      setMetrics(data);
    } catch {
      console.error('Error al cargar métricas');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-[#371851]/5 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-[#371851]/5 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  const pieData = [
    { name: 'Pendientes', value: metrics.byStatus.pending },
    { name: 'Consumidas', value: metrics.byStatus.consumed },
  ];

  const statsCards = [
    {
      label: 'Total Prescripciones',
      value: metrics.totals.prescriptions,
      icon: <FileText size={20} />,
      color: 'bg-[#371851] text-white',
    },
    {
      label: 'Pendientes',
      value: metrics.byStatus.pending,
      icon: <Clock size={20} />,
      color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
    },
    {
      label: 'Consumidas',
      value: metrics.byStatus.consumed,
      icon: <CheckCircle size={20} />,
      color: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
    },
    {
      label: 'Médicos / Pacientes',
      value: `${metrics.totals.doctors} / ${metrics.totals.patients}`,
      icon: <Users size={20} />,
      color: 'bg-[#18B0C6]/10 text-[#18B0C6]',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#371851] dark:text-white">Dashboard</h1>
        <p className="text-sm text-[#371851]/50 dark:text-white/50 mt-1">Vista general del sistema</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsCards.map((card) => (
          <div
            key={card.label}
            className="p-5 rounded-2xl border border-[#371851]/10 dark:border-white/10 bg-white dark:bg-white/5 space-y-3"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-2xl font-black text-[#371851] dark:text-white">{card.value}</p>
              <p className="text-xs text-[#371851]/50 dark:text-white/50 mt-0.5">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Prescripciones por día */}
        <div className="p-5 rounded-2xl border border-[#371851]/10 dark:border-white/10 bg-white dark:bg-white/5">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={16} className="text-[#18B0C6]" />
            <span className="text-xs font-black uppercase tracking-widest text-[#371851]/40 dark:text-white/40">
              Prescripciones por día
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={metrics.byDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#37185110" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: '#37185180' }}
                tickFormatter={(v) => new Date(v).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}
              />
              <YAxis tick={{ fontSize: 10, fill: '#37185180' }} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #37185120',
                  fontSize: '12px',
                }}
                labelFormatter={(v) => new Date(v).toLocaleDateString('es-CO', { day: '2-digit', month: 'long' })}
              />
              <Bar dataKey="count" fill="#371851" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución por estado */}
        <div className="p-5 rounded-2xl border border-[#371851]/10 dark:border-white/10 bg-white dark:bg-white/5">
          <div className="flex items-center gap-2 mb-6">
            <FileText size={16} className="text-[#18B0C6]" />
            <span className="text-xs font-black uppercase tracking-widest text-[#371851]/40 dark:text-white/40">
              Distribución por estado
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #37185120',
                  fontSize: '12px',
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span style={{ fontSize: '11px', fontWeight: 'bold' }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top médicos */}
      {metrics.topDoctors.length > 0 && (
        <div className="p-5 rounded-2xl border border-[#371851]/10 dark:border-white/10 bg-white dark:bg-white/5">
          <div className="flex items-center gap-2 mb-5">
            <Users size={16} className="text-[#18B0C6]" />
            <span className="text-xs font-black uppercase tracking-widest text-[#371851]/40 dark:text-white/40">
              Top médicos
            </span>
          </div>
          <div className="space-y-3">
            {metrics.topDoctors.map((doctor, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-7 h-7 rounded-lg bg-[#371851] flex items-center justify-center shrink-0">
                  <span className="text-white text-[10px] font-black">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-[#371851] dark:text-white truncate">
                      {doctor.doctorId.slice(-6).toUpperCase()}
                    </span>
                    <span className="text-xs font-black text-[#18B0C6] shrink-0 ml-2">{doctor.count}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#371851]/10 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#18B0C6] rounded-full"
                      style={{ width: `${(doctor.count / metrics.topDoctors[0].count) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}