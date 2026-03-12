'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/axios';
import { 
  Users, Search, ChevronUp, ChevronDown, 
  ChevronsUpDown, User, Stethoscope, Heart, Plus,
  Mail, Shield, X
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'patient';
  createdAt: string;
}

type SortField = 'name' | 'email' | 'role' | 'createdAt';
type SortOrder = 'asc' | 'desc';

const userSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  role: z.enum(['admin', 'doctor', 'patient']),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

const roleConfig = {
  admin: { label: 'Admin', icon: <User size={12} />, color: 'bg-[#371851] text-white' },
  doctor: { label: 'Médico', icon: <Stethoscope size={12} />, color: 'bg-[#18B0C6]/20 text-[#18B0C6]' },
  patient: { label: 'Paciente', icon: <Heart size={12} />, color: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' },
};

const AgentModalWrapper = ({ children, closeModal }: any) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(closeModal, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-center transition-all duration-500 ${
        show ? 'bg-[#371851]/20 backdrop-blur-md' : 'bg-transparent backdrop-blur-0'
      }`}
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`mx-4 transform transition-all duration-300 ease-out w-full max-w-md ${
          show ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
        } bg-white/80 dark:bg-[#0f0a1a]/80 border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-2xl`}
      >
        {children}
      </div>
    </div>
  );
};

function UserForm({ onSuccess, onCancel }: any) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: { role: 'patient' } as any
  });

  const onSubmit = async (values: any) => {
    try {
      await api.post('/users', values);
      toast.success('Usuario creado con éxito');
      onSuccess();
    } catch {
      toast.error('Error al crear usuario');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-black text-[#371851] dark:text-white">Nuevo Usuario</h2>
        <p className="text-xs text-[#371851]/50 dark:text-white/50">Registro administrativo de personal</p>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#371851]/40" />
          <input {...register('name')} placeholder="Nombre completo" className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#371851]/10 dark:bg-white/5 dark:text-white text-sm focus:outline-none focus:border-[#18B0C6] transition" />
        </div>
        
        <div className="relative">
          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#371851]/40" />
          <input {...register('email')} type="email" placeholder="Correo electrónico" className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#371851]/10 dark:bg-white/5 dark:text-white text-sm focus:outline-none focus:border-[#18B0C6] transition" />
        </div>

        <div className="relative">
          <Shield size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#371851]/40" />
          <select {...register('role')} className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#371851]/10 dark:bg-white/5 dark:text-white text-sm appearance-none focus:outline-none focus:border-[#18B0C6] transition cursor-pointer">
            <option value="patient">Paciente</option>
            <option value="doctor">Médico</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <input {...register('password')} type="password" placeholder="Contraseña temporal" className="w-full px-4 py-3 rounded-xl border border-[#371851]/10 dark:bg-white/5 dark:text-white text-sm focus:outline-none focus:border-[#18B0C6] transition" />
      </div>

      <div className="flex gap-2 pt-4">
        <button type="button" onClick={onCancel} className="flex-1 py-3 rounded-xl font-bold text-sm text-[#371851]/50 hover:bg-[#371851]/5 transition">Cancelar</button>
        <button disabled={isSubmitting} className="flex-1 py-3 rounded-xl font-bold text-sm bg-[#371851] dark:bg-[#18B0C6] text-white hover:opacity-90 transition disabled:opacity-50">
          {isSubmitting ? 'Guardando...' : 'Crear Usuario'}
        </button>
      </div>
    </form>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const limit = 10;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (roleFilter) params.append('role', roleFilter);
      params.append('page', String(page));
      params.append('limit', String(limit));
      const { data } = await api.get(`/users?${params.toString()}`);
      setUsers(data.data);
      setTotal(data.total);
    } catch {
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  }, [roleFilter, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ChevronsUpDown size={14} className="text-[#371851]/30 dark:text-white/30" />;
    return sortOrder === 'asc'
      ? <ChevronUp size={14} className="text-[#18B0C6]" />
      : <ChevronDown size={14} className="text-[#18B0C6]" />;
  }

  const filtered = users
    .filter((u) => {
      if (!search) return true;
      return (
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      );
    })
    .sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];
      if (sortField === 'createdAt') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#371851] dark:text-white text-balance">Usuarios del Sistema</h1>
          <p className="text-sm text-[#371851]/50 dark:text-white/50 mt-1">{total} registros encontrados</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#371851] dark:bg-[#18B0C6] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:scale-105 transition shadow-lg shadow-[#18B0C6]/10"
        >
          <Plus size={18} />
          Nuevo Usuario
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#371851]/40 dark:text-white/40" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#371851]/15 dark:border-white/10 bg-[#371851]/5 dark:bg-white/5 text-[#371851] dark:text-white text-sm focus:outline-none focus:border-[#18B0C6] transition"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="px-4 py-3 rounded-xl border border-[#371851]/15 dark:border-white/10 bg-white dark:bg-[#0f0a1a] text-[#371851] dark:text-white text-sm focus:outline-none focus:border-[#18B0C6] transition appearance-none cursor-pointer"
        >
          <option value="">Todos los roles</option>
          <option value="admin">Admin</option>
          <option value="doctor">Médico</option>
          <option value="patient">Paciente</option>
        </select>
      </div>

      <div className="rounded-2xl border border-[#371851]/10 dark:border-white/10 overflow-hidden bg-white dark:bg-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#371851]/10 dark:border-white/10 bg-[#371851]/5 dark:bg-white/5">
                {[
                  { label: 'Usuario', field: 'name' as SortField },
                  { label: 'Email', field: 'email' as SortField },
                  { label: 'Rol', field: 'role' as SortField },
                  { label: 'Registro', field: 'createdAt' as SortField },
                ].map((col) => (
                  <th
                    key={col.field}
                    onClick={() => handleSort(col.field)}
                    className="px-5 py-4 cursor-pointer select-none group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#371851]/50 dark:text-white/50 group-hover:text-[#371851] dark:group-hover:text-white transition">
                        {col.label}
                      </span>
                      <SortIcon field={col.field} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-[#371851]/5 dark:border-white/5">
                    {[...Array(4)].map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 rounded-lg bg-[#371851]/5 dark:bg-white/5 animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#371851]/5 dark:bg-white/5 flex items-center justify-center">
                        <Users size={22} className="text-[#371851]/30 dark:text-white/30" />
                      </div>
                      <p className="font-bold text-sm text-[#371851]/50 dark:text-white/50">No se encontraron usuarios</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const config = roleConfig[u.role];
                  return (
                    <tr
                      key={u.id}
                      className="border-b border-[#371851]/5 dark:border-white/5 hover:bg-[#371851]/5 dark:hover:bg-white/5 transition"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#371851] flex items-center justify-center shrink-0">
                            <span className="text-white font-black text-[10px]">
                              {u.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-bold text-sm text-[#371851] dark:text-white">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-[#371851]/60 dark:text-white/60">{u.email}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${config.color}`}>
                          {config.icon}
                          {config.label}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-[#371851]/50 dark:text-white/50">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl border border-[#371851]/15 dark:border-white/10 text-xs font-bold disabled:opacity-40 hover:bg-[#371851]/5 dark:hover:bg-white/5 transition"
          >
            Anterior
          </button>
          <span className="text-xs font-bold text-[#371851]/50 dark:text-white/50">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-xl border border-[#371851]/15 dark:border-white/10 text-xs font-bold disabled:opacity-40 hover:bg-[#371851]/5 dark:hover:bg-white/5 transition"
          >
            Siguiente
          </button>
        </div>
      )}

      {isModalOpen && (
        <AgentModalWrapper closeModal={() => setIsModalOpen(false)}>
          <UserForm 
            onSuccess={() => { setIsModalOpen(false); fetchUsers(); }} 
            onCancel={() => setIsModalOpen(false)} 
          />
        </AgentModalWrapper>
      )}
    </div>
  );
}