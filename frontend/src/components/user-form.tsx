'use client';

import { useForm, useWatch } from 'react-hook-form'; // Importamos useWatch
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Mail, Shield, Key, Stethoscope } from 'lucide-react'; // Cambié Plus por Key y Stethoscope
import api from '@/lib/axios';
import toast from 'react-hot-toast';

const userSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  role: z.enum(['admin', 'doctor', 'patient']),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  specialty: z.string().optional(), // Campo opcional para doctores
});

export default function UserForm({ onSuccess, onCancel }: any) {
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: { role: 'patient', specialty: 'General Medicine' }
  });

  // Observamos el rol para mostrar/ocultar la especialidad
  const selectedRole = useWatch({ control, name: 'role' });

  const onSubmit = async (values: any) => {
    try {
      await api.post('/users', values);
      toast.success('Usuario creado con éxito');
      onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al crear usuario';
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-black text-[#371851] dark:text-white">Nuevo Usuario</h2>
        <p className="text-xs text-[#371851]/50 dark:text-white/50">Completa los datos para el registro</p>
      </div>

      <div className="space-y-3">
        {/* Nombre */}
        <div className="relative">
          <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#371851]/40" />
          <input {...register('name')} placeholder="Nombre completo" className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#371851]/10 dark:bg-white/5 dark:text-white text-sm focus:outline-none focus:border-[#18B0C6] transition" />
        </div>
        {errors.name && <p className="text-[10px] text-red-500 ml-2">{errors.name.message as string}</p>}
        
        {/* Email */}
        <div className="relative">
          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#371851]/40" />
          <input {...register('email')} type="email" placeholder="Correo electrónico" className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#371851]/10 dark:bg-white/5 dark:text-white text-sm focus:outline-none focus:border-[#18B0C6] transition" />
        </div>
        {errors.email && <p className="text-[10px] text-red-500 ml-2">{errors.email.message as string}</p>}

        {/* Rol */}
        <div className="relative">
          <Shield size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#371851]/40" />
          <select {...register('role')} className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#371851]/10 dark:bg-white/5 dark:text-white text-sm appearance-none focus:outline-none focus:border-[#18B0C6] transition">
            <option value="patient">Paciente</option>
            <option value="doctor">Médico</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        {/* Especialidad (Solo si es Doctor) */}
        {selectedRole === 'doctor' && (
          <div className="relative animate-in fade-in slide-in-from-top-1">
            <Stethoscope size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#371851]/40" />
            <input {...register('specialty')} placeholder="Especialidad (ej. Cardiología)" className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#371851]/10 dark:bg-white/5 dark:text-white text-sm focus:outline-none focus:border-[#18B0C6] transition" />
          </div>
        )}

        {/* Password */}
        <div className="relative">
          <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#371851]/40" />
          <input {...register('password')} type="password" placeholder="Contraseña temporal" className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#371851]/10 dark:bg-white/5 dark:text-white text-sm focus:outline-none focus:border-[#18B0C6] transition" />
        </div>
        {errors.password && <p className="text-[10px] text-red-500 ml-2">{errors.password.message as string}</p>}
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