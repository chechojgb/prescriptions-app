'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { FileText, Search, Filter, Eye, Clock, CheckCircle, Pill } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface Prescription {
  id: string;
  code: string;
  status: 'pending' | 'consumed';
  notes: string;
  createdAt: string;
  doctor: {
    user: { name: string; email: string };
  };
  items: { id: string; name: string; dosage: string }[];
}

export default function PatientPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [consuming, setConsuming] = useState<string | null>(null);
  const limit = 10;

  useEffect(() => {
    fetchPrescriptions();
  }, [status, page]);

  async function fetchPrescriptions() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      params.append('page', String(page));
      params.append('limit', String(limit));

      const { data } = await api.get(`/me/prescriptions?${params.toString()}`);
      setPrescriptions(data.data);
      setTotal(data.total);
    } catch {
      toast.error('Error al cargar prescripciones');
    } finally {
      setLoading(false);
    }
  }

  async function handleConsume(id: string) {
    setConsuming(id);
    try {
      await api.put(`/prescriptions/${id}/consume`);
      toast.success('Prescripción marcada como consumida');
      fetchPrescriptions();
    } catch {
      toast.error('Error al consumir la prescripción');
    } finally {
      setConsuming(null);
    }
  }

  const totalPages = Math.ceil(total / limit);

  const filtered = prescriptions.filter((p) => {
    if (!search) return true;
    return (
      p.doctor?.user?.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#371851] dark:text-white">Mis Prescripciones</h1>
        <p className="text-sm text-[#371851]/50 dark:text-white/50 mt-1">{total} prescripciones en total</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#371851]/40 dark:text-white/40" />
          <input
            type="text"
            placeholder="Buscar por médico o código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#371851]/15 dark:border-white/10 bg-[#371851]/5 dark:bg-white/5 text-[#371851] dark:text-white text-sm focus:outline-none focus:border-[#18B0C6] transition"
          />
        </div>
        <div className="relative">
          <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#371851]/40 dark:text-white/40" />
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="pl-10 pr-8 py-3 rounded-xl border border-[#371851]/15 dark:border-white/10 bg-white dark:bg-[#0f0a1a] text-[#371851] dark:text-white text-sm focus:outline-none focus:border-[#18B0C6] transition appearance-none cursor-pointer"
          >
            <option value="">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="consumed">Consumida</option>
          </select>
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-[#371851]/5 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#371851]/5 dark:bg-white/5 flex items-center justify-center mb-4">
            <FileText size={28} className="text-[#371851]/30 dark:text-white/30" />
          </div>
          <p className="font-bold text-[#371851]/50 dark:text-white/50">No tienes prescripciones</p>
          <p className="text-sm text-[#371851]/30 dark:text-white/30 mt-1">Tu médico aún no ha generado prescripciones</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="p-5 rounded-2xl border border-[#371851]/10 dark:border-white/10 bg-white dark:bg-white/5 hover:border-[#18B0C6]/40 transition"
            >
              <div className="flex items-start gap-4">
                {/* Icono estado */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  p.status === 'pending'
                    ? 'bg-amber-100 dark:bg-amber-500/20'
                    : 'bg-green-100 dark:bg-green-500/20'
                }`}>
                  {p.status === 'pending'
                    ? <Clock size={18} className="text-amber-600 dark:text-amber-400" />
                    : <CheckCircle size={18} className="text-green-600 dark:text-green-400" />
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-sm text-[#371851] dark:text-white">
                      Dr. {p.doctor?.user?.name}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      p.status === 'pending'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                        : 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                    }`}>
                      {p.status === 'pending' ? 'Pendiente' : 'Consumida'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#371851]/50 dark:text-white/50 mb-3">
                    <span>{p.code}</span>
                    <span>·</span>
                    <span>{new Date(p.createdAt).toLocaleDateString('es-CO')}</span>
                  </div>

                  {/* Preview medicamentos */}
                  <div className="flex flex-wrap gap-2">
                    {p.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#371851]/5 dark:bg-white/5 border border-[#371851]/10 dark:border-white/10">
                        <Pill size={11} className="text-[#18B0C6]" />
                        <span className="text-[10px] font-bold text-[#371851]/70 dark:text-white/70">{item.name}</span>
                      </div>
                    ))}
                    {p.items.length > 3 && (
                      <div className="flex items-center px-3 py-1 rounded-lg bg-[#371851]/5 dark:bg-white/5 border border-[#371851]/10 dark:border-white/10">
                        <span className="text-[10px] font-bold text-[#371851]/40 dark:text-white/40">+{p.items.length - 3} más</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-col gap-2 shrink-0">
                  <Link
                    href={`/patient/prescriptions/${p.id}`}
                    className="w-9 h-9 rounded-xl border border-[#371851]/10 dark:border-white/10 flex items-center justify-center hover:bg-[#371851] hover:border-[#371851] hover:text-white dark:hover:bg-white/10 transition text-[#371851]/50 dark:text-white/50"
                  >
                    <Eye size={15} />
                  </Link>
                  {p.status === 'pending' && (
                    <button
                      onClick={() => handleConsume(p.id)}
                      disabled={consuming === p.id}
                      className="w-9 h-9 rounded-xl bg-[#18B0C6]/10 border border-[#18B0C6]/20 flex items-center justify-center hover:bg-[#18B0C6] hover:text-white transition text-[#18B0C6] disabled:opacity-50"
                      title="Marcar como consumida"
                    >
                      <CheckCircle size={15} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl border border-[#371851]/15 dark:border-white/10 text-sm font-bold disabled:opacity-40 hover:bg-[#371851]/5 dark:hover:bg-white/5 transition"
          >
            Anterior
          </button>
          <span className="text-sm text-[#371851]/50 dark:text-white/50">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-xl border border-[#371851]/15 dark:border-white/10 text-sm font-bold disabled:opacity-40 hover:bg-[#371851]/5 dark:hover:bg-white/5 transition"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}