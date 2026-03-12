'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Plus, Trash2, ArrowLeft, Loader2, Search } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

interface Item {
  name: string;
  dosage: string;
  quantity: number;
  instructions: string;
}

interface Patient {
  id: string;
  user: { name: string; email: string };
}

export default function NewPrescriptionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPatientList, setShowPatientList] = useState(false);
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<Item[]>([
    { name: '', dosage: '', quantity: 1, instructions: '' },
  ]);

  useEffect(() => {
    if (patientSearch.length > 1) {
      searchPatients();
    }
  }, [patientSearch]);

    async function searchPatients() {
    try {
        const { data } = await api.get(`/users/patients/search?query=${patientSearch}`);
        setPatients(data.data);
        setShowPatientList(true);
    } catch {
        console.error('Error buscando pacientes');
    }
    }

  function addItem() {
    setItems([...items, { name: '', dosage: '', quantity: 1, instructions: '' }]);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof Item, value: string | number) {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPatient) {
      toast.error('Selecciona un paciente');
      return;
    }
    if (items.some(item => !item.name)) {
      toast.error('Todos los ítems deben tener nombre');
      return;
    }

    setLoading(true);
    try {
      await api.post('/prescriptions', {
        patientId: selectedPatient.id,
        notes,
        items,
      });
      toast.success('Prescripción creada exitosamente');
      router.push('/doctor/prescriptions');
    } catch {
      toast.error('Error al crear la prescripción');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/doctor/prescriptions"
          className="w-9 h-9 rounded-xl border border-[#371851]/15 dark:border-white/10 flex items-center justify-center hover:bg-[#371851]/5 dark:hover:bg-white/5 transition"
        >
          <ArrowLeft size={16} className="text-[#371851] dark:text-white" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-[#371851] dark:text-white">Nueva Prescripción</h1>
          <p className="text-sm text-[#371851]/50 dark:text-white/50 mt-1">Completa los datos de la prescripción</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Buscar paciente */}
        <div className="p-6 rounded-2xl border border-[#371851]/10 dark:border-white/10 bg-white dark:bg-white/5 space-y-4">
          <h2 className="font-black text-[#371851] dark:text-white">Paciente</h2>

          {selectedPatient ? (
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#371851]/5 dark:bg-white/5 border border-[#371851]/10 dark:border-white/10">
              <div>
                <p className="font-bold text-sm text-[#371851] dark:text-white">{selectedPatient.user.name}</p>
                <p className="text-xs text-[#371851]/50 dark:text-white/50">{selectedPatient.user.email}</p>
              </div>
              <button
                type="button"
                onClick={() => { setSelectedPatient(null); setPatientSearch(''); }}
                className="text-xs font-bold text-[#18B0C6] hover:underline"
              >
                Cambiar
              </button>
            </div>
          ) : (
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#371851]/40 dark:text-white/40" />
              <input
                type="text"
                placeholder="Buscar paciente por nombre o email..."
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#371851]/15 dark:border-white/10 bg-[#371851]/5 dark:bg-white/5 text-[#371851] dark:text-white text-sm focus:outline-none focus:border-[#18B0C6] transition"
              />
              {showPatientList && patients.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1a0c2e] border border-[#371851]/10 dark:border-white/10 rounded-xl shadow-xl z-10 overflow-hidden">
                  {patients.map((patient) => (
                    <button
                      key={patient.id}
                      type="button"
                      onClick={() => {
                        setSelectedPatient(patient);
                        setShowPatientList(false);
                        setPatientSearch('');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#371851]/5 dark:hover:bg-white/5 transition text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#371851] flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-bold">
                          {patient.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[#371851] dark:text-white">{patient.user.name}</p>
                        <p className="text-xs text-[#371851]/50 dark:text-white/50">{patient.user.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notas */}
        <div className="p-6 rounded-2xl border border-[#371851]/10 dark:border-white/10 bg-white dark:bg-white/5 space-y-4">
          <h2 className="font-black text-[#371851] dark:text-white">Notas</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Indicaciones generales, observaciones..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-[#371851]/15 dark:border-white/10 bg-[#371851]/5 dark:bg-white/5 text-[#371851] dark:text-white text-sm focus:outline-none focus:border-[#18B0C6] transition resize-none"
          />
        </div>

        {/* Ítems */}
        <div className="p-6 rounded-2xl border border-[#371851]/10 dark:border-white/10 bg-white dark:bg-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-[#371851] dark:text-white">Medicamentos</h2>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-2 text-sm font-bold text-[#18B0C6] hover:underline"
            >
              <Plus size={16} />
              Agregar
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="p-4 rounded-xl border border-[#371851]/10 dark:border-white/10 bg-[#371851]/5 dark:bg-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-[#371851]/40 dark:text-white/40">
                    Medicamento {index + 1}
                  </span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-400 hover:text-red-600 transition"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Nombre del medicamento *"
                  value={item.name}
                  onChange={(e) => updateItem(index, 'name', e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#371851]/15 dark:border-white/10 bg-white dark:bg-white/5 text-[#371851] dark:text-white text-sm focus:outline-none focus:border-[#18B0C6] transition"
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Dosis (ej: 1 cada 8h)"
                    value={item.dosage}
                    onChange={(e) => updateItem(index, 'dosage', e.target.value)}
                    className="px-4 py-3 rounded-xl border border-[#371851]/15 dark:border-white/10 bg-white dark:bg-white/5 text-[#371851] dark:text-white text-sm focus:outline-none focus:border-[#18B0C6] transition"
                  />
                  <input
                    type="number"
                    placeholder="Cantidad"
                    value={item.quantity}
                    min={1}
                    onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                    className="px-4 py-3 rounded-xl border border-[#371851]/15 dark:border-white/10 bg-white dark:bg-white/5 text-[#371851] dark:text-white text-sm focus:outline-none focus:border-[#18B0C6] transition"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Instrucciones (ej: Después de comer)"
                  value={item.instructions}
                  onChange={(e) => updateItem(index, 'instructions', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#371851]/15 dark:border-white/10 bg-white dark:bg-white/5 text-[#371851] dark:text-white text-sm focus:outline-none focus:border-[#18B0C6] transition"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Botón submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#371851] dark:bg-[#18B0C6] text-white py-4 rounded-2xl font-bold hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Creando...
            </>
          ) : (
            'Crear Prescripción'
          )}
        </button>
      </form>
    </div>
  );
}