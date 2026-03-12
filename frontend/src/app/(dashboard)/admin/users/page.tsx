'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Users, Search, ChevronUp, ChevronDown, ChevronsUpDown, User, Stethoscope, Heart } from 'lucide-react';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'patient';
  createdAt: string;
}

type SortField = 'name' | 'email' | 'role' | 'createdAt';
type SortOrder = 'asc' | 'desc';

const roleConfig = {
  admin: { label: 'Admin', icon: <User size={12} />, color: 'bg-[#371851] text-white' },
  doctor: { label: 'Médico', icon: <Stethoscope size={12} />, color: 'bg-[#18B0C6]/20 text-[#18B0C6]' },
  patient: { label: 'Paciente', icon: <Heart size={12} />, color: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const limit = 10;

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, page]);

  async function fetchUsers() {
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
      console.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  }

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
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.role.toLowerCase().includes(search.toLowerCase())
      );
    })
    .sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (sortField === 'createdAt') {
        valA = new Date(valA).getTime().toString();
        valB = new Date(valB).getTime().toString();
      }
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#371851] dark:text-white">Usuarios</h1>
        <p className="text-sm text-[#371851]/50 dark:text-white/50 mt-1">{total} usuarios en el sistema</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#371851]/40 dark:text-white/40" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o rol..."
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

      {/* Tabla */}
      <div className="rounded-2xl border border-[#371851]/10 dark:border-white/10 overflow-hidden bg-white dark:bg-white/5">
        <div className="overflow-x-auto">
          <table className="w-full">
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
                    className="px-5 py-4 text-left cursor-pointer select-none group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-widest text-[#371851]/50 dark:text-white/50 group-hover:text-[#371851] dark:group-hover:text-white transition">
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
                      <p className="font-bold text-sm text-[#371851]/50 dark:text-white/50">No hay usuarios</p>
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
                      {/* Usuario */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#371851] flex items-center justify-center shrink-0">
                            <span className="text-white font-black text-xs">
                              {u.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-bold text-sm text-[#371851] dark:text-white">{u.name}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4">
                        <span className="text-sm text-[#371851]/60 dark:text-white/60">{u.email}</span>
                      </td>

                      {/* Rol */}
                      <td className="px-5 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${config.color}`}>
                          {config.icon}
                          {config.label}
                        </div>
                      </td>

                      {/* Fecha */}
                      <td className="px-5 py-4">
                        <span className="text-sm text-[#371851]/50 dark:text-white/50">
                          {new Date(u.createdAt).toLocaleDateString('es-CO', {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })}
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

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
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