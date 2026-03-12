'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { ArrowLeft, Clock, CheckCircle, Pill, User, Calendar, FileText, Download, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface Prescription {
  id: string;
  code: string;
  status: 'pending' | 'consumed';
  notes: string;
  createdAt: string;
  patient: {
    user: { name: string; email: string };
  };
  author: {
    user: { name: string; email: string };
  };
  items: {
    id: string;
    name: string;
    dosage: string;
    quantity: number;
    instructions: string;
  }[];
}

export default function DoctorPrescriptionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchPrescription();
  }, [id]);

  async function fetchPrescription() {
    try {
      const { data } = await api.get(`/prescriptions/${id}`);
      setPrescription(data);
    } catch {
      toast.error('Error al cargar la prescripción');
      router.push('/doctor/prescriptions');
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadPDF() {
    setDownloading(true);
    try {
      const response = await api.get(`/prescriptions/${id}/pdf`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prescripcion-${prescription?.code}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Error al descargar el PDF');
    } finally {
      setDownloading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-[#18B0C6]" />
      </div>
    );
  }

  if (!prescription) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/prescriptions"
            className="w-9 h-9 rounded-xl border border-[#371851]/15 dark:border-white/10 flex items-center justify-center hover:bg-[#371851]/5 dark:hover:bg-white/5 transition"
          >
            <ArrowLeft size={16} className="text-[#371851] dark:text-white" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-[#371851] dark:text-white">Detalle</h1>
            <p className="text-sm text-[#371851]/50 dark:text-white/50 mt-1">{prescription.code}</p>
          </div>
        </div>
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="flex items-center gap-2 bg-[#371851] dark:bg-[#18B0C6] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition disabled:opacity-60"
        >
          {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          PDF
        </button>
      </div>

      {/* Estado */}
      <div className={`flex items-center gap-3 p-4 rounded-2xl border ${
        prescription.status === 'pending'
          ? 'bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20'
          : 'bg-green-50 border-green-200 dark:bg-green-500/10 dark:border-green-500/20'
      }`}>
        {prescription.status === 'pending'
          ? <Clock size={20} className="text-amber-600 dark:text-amber-400" />
          : <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
        }
        <div>
          <p className={`font-bold text-sm ${
            prescription.status === 'pending'
              ? 'text-amber-700 dark:text-amber-400'
              : 'text-green-700 dark:text-green-400'
          }`}>
            {prescription.status === 'pending' ? 'Pendiente' : 'Consumida'}
          </p>
          <p className="text-xs text-[#371851]/50 dark:text-white/50">
            Creada el {new Date(prescription.createdAt).toLocaleDateString('es-CO', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Info médico y paciente */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-[#371851]/10 dark:border-white/10 bg-white dark:bg-white/5 space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <User size={16} className="text-[#18B0C6]" />
            <span className="text-xs font-black uppercase tracking-widest text-[#371851]/40 dark:text-white/40">Médico</span>
          </div>
          <p className="font-bold text-sm text-[#371851] dark:text-white">{prescription.author?.user?.name}</p>
          <p className="text-xs text-[#371851]/50 dark:text-white/50">{prescription.author?.user?.email}</p>
        </div>
        <div className="p-5 rounded-2xl border border-[#371851]/10 dark:border-white/10 bg-white dark:bg-white/5 space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <User size={16} className="text-[#18B0C6]" />
            <span className="text-xs font-black uppercase tracking-widest text-[#371851]/40 dark:text-white/40">Paciente</span>
          </div>
          <p className="font-bold text-sm text-[#371851] dark:text-white">{prescription.patient?.user?.name}</p>
          <p className="text-xs text-[#371851]/50 dark:text-white/50">{prescription.patient?.user?.email}</p>
        </div>
      </div>

      {/* Notas */}
      {prescription.notes && (
        <div className="p-5 rounded-2xl border border-[#371851]/10 dark:border-white/10 bg-white dark:bg-white/5">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={16} className="text-[#18B0C6]" />
            <span className="text-xs font-black uppercase tracking-widest text-[#371851]/40 dark:text-white/40">Notas</span>
          </div>
          <p className="text-sm text-[#371851]/70 dark:text-white/70 leading-relaxed">{prescription.notes}</p>
        </div>
      )}

      {/* Medicamentos */}
      <div className="p-5 rounded-2xl border border-[#371851]/10 dark:border-white/10 bg-white dark:bg-white/5">
        <div className="flex items-center gap-2 mb-4">
          <Pill size={16} className="text-[#18B0C6]" />
          <span className="text-xs font-black uppercase tracking-widest text-[#371851]/40 dark:text-white/40">
            Medicamentos ({prescription.items.length})
          </span>
        </div>
        <div className="space-y-3">
          {prescription.items.map((item, index) => (
            <div
              key={item.id}
              className="flex items-start gap-4 p-4 rounded-xl bg-[#371851]/5 dark:bg-white/5 border border-[#371851]/5 dark:border-white/5"
            >
              <div className="w-8 h-8 rounded-lg bg-[#18B0C6]/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[#18B0C6] text-xs font-black">{index + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-[#371851] dark:text-white mb-1">{item.name}</p>
                <div className="flex flex-wrap gap-2">
                  {item.dosage && (
                    <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-[#371851]/10 dark:bg-white/10 text-[#371851]/70 dark:text-white/70">
                      {item.dosage}
                    </span>
                  )}
                  {item.quantity && (
                    <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-[#18B0C6]/10 text-[#18B0C6]">
                      {item.quantity} unidades
                    </span>
                  )}
                  {item.instructions && (
                    <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-[#371851]/10 dark:bg-white/10 text-[#371851]/70 dark:text-white/70">
                      {item.instructions}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}