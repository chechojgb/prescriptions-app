'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Stethoscope, Loader2 } from 'lucide-react';
import { login } from '@/lib/auth';
import { useAuthStore } from '@/store/authStore';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
        if (user.role === 'doctor') router.push('/doctor');
        if (user.role === 'patient') router.push('/patient');
        if (user.role === 'admin') router.push('/admin');
        }
    }, [user]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
        const user = await login(email, password);
        toast.success(`Bienvenido, ${user.name}`);
        if (user.role === 'doctor') router.push('/doctor');
        if (user.role === 'patient') router.push('/patient');
        if (user.role === 'admin') router.push('/admin');
        } catch {
        toast.error('Credenciales inválidas');
        } finally {
        setLoading(false);
        }
    }

  return (
    <main className="min-h-screen bg-white dark:bg-[#080412] flex">
      <Toaster position="top-right" />

      {/* Lado izquierdo — decorativo */}
      <div className="hidden md:flex w-1/2 bg-[#371851] flex-col justify-between p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#18B0C6]/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/5 blur-2xl" />

        <Link href="/" className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-[#18B0C6] flex items-center justify-center">
            <Stethoscope size={18} className="text-white" />
          </div>
          <span className="font-black text-white text-xl">RxSystem</span>
        </Link>

        <div className="relative z-10">
          <h2 className="text-5xl font-black text-white leading-tight mb-6">
            Tu plataforma <br />
            <span className="text-[#18B0C6]">médica digital</span>
          </h2>
          <p className="text-white/50 text-lg leading-relaxed max-w-sm">
            Gestiona prescripciones, conecta con pacientes y visualiza métricas en tiempo real.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { value: '1.2K+', label: 'Prescripciones' },
            { value: '340+', label: 'Médicos' },
            { value: '2.8K+', label: 'Pacientes' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-white/40 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Lado derecho — formulario */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* Logo móvil */}
          <Link href="/" className="flex md:hidden items-center gap-2 mb-10 justify-center">
            <div className="w-8 h-8 rounded-xl bg-[#371851] flex items-center justify-center">
              <Stethoscope size={16} className="text-white" />
            </div>
            <span className="font-black text-[#371851] dark:text-white text-lg">RxSystem</span>
          </Link>

          <h1 className="text-4xl font-black text-[#371851] dark:text-white mb-2">Bienvenido</h1>
          <p className="text-[#371851]/50 dark:text-white/50 mb-10">Ingresa tus credenciales para continuar.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-[#371851]/70 dark:text-white/70 mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@ejemplo.com"
                required
                className="w-full px-4 py-4 rounded-2xl border border-[#371851]/15 dark:border-white/10 bg-[#371851]/5 dark:bg-white/5 text-[#371851] dark:text-white placeholder-[#371851]/30 dark:placeholder-white/30 focus:outline-none focus:border-[#18B0C6] focus:ring-2 focus:ring-[#18B0C6]/20 transition text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-[#371851]/70 dark:text-white/70 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-4 rounded-2xl border border-[#371851]/15 dark:border-white/10 bg-[#371851]/5 dark:bg-white/5 text-[#371851] dark:text-white placeholder-[#371851]/30 dark:placeholder-white/30 focus:outline-none focus:border-[#18B0C6] focus:ring-2 focus:ring-[#18B0C6]/20 transition text-sm pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#371851]/40 dark:text-white/40 hover:text-[#18B0C6] transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#371851] text-white py-4 rounded-2xl font-bold text-sm hover:bg-[#18B0C6] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Ingresando...
                </>
              ) : (
                'Ingresar'
              )}
            </button>
          </form>

          {/* Cuentas de prueba */}
          <div className="mt-10 p-5 rounded-2xl bg-[#371851]/5 dark:bg-white/5 border border-[#371851]/10 dark:border-white/10">
            <p className="text-xs font-black uppercase tracking-widest text-[#371851]/40 dark:text-white/40 mb-4">Cuentas de prueba</p>
            <div className="space-y-2">
              {[
                { role: 'Admin', email: 'admin@test.com', password: 'admin123' },
                { role: 'Médico', email: 'dr@test.com', password: 'dr123' },
                { role: 'Paciente', email: 'patient@test.com', password: 'patient123' },
              ].map((account) => (
                <button
                  key={account.role}
                  onClick={() => { setEmail(account.email); setPassword(account.password); }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-[#371851]/10 dark:hover:bg-white/10 transition group"
                >
                  <span className="text-xs font-bold text-[#371851]/60 dark:text-white/60 group-hover:text-[#371851] dark:group-hover:text-white transition">{account.role}</span>
                  <span className="text-xs text-[#371851]/40 dark:text-white/40">{account.email}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}