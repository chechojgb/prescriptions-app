import { Stethoscope, Users, BarChart3 } from 'lucide-react';

export default function Roles (){
    return(
        <section id="roles" className="relative z-10 px-6 py-24 max-w-6xl mx-auto">
            <div className="mb-14">
                <span className="text-[#18B0C6] text-xs font-black uppercase tracking-widest">Roles del sistema</span>
                <h2 className="text-5xl font-black mt-3 leading-tight">
                Nuestros<br />
                <span className="text-[#371851] dark:text-white">Usuarios</span>
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                {
                    title: 'Médico',
                    desc: 'Crea prescripciones digitales con ítems personalizados para cada paciente al instante.',
                    icon: <Stethoscope size={26} className="text-white" />,
                    bg: 'bg-[#371851]',
                    textColor: 'text-white',
                    descColor: 'text-white/60',
                },
                {
                    title: 'Paciente',
                    desc: 'Consulta, descarga y gestiona tus prescripciones desde cualquier dispositivo.',
                    icon: <Users size={26} className="text-[#371851]" />,
                    bg: 'bg-[#18B0C6]',
                    textColor: 'text-[#371851]',
                    descColor: 'text-[#371851]/70',
                },
                {
                    title: 'Administrador',
                    desc: 'Visualiza métricas completas y gestiona el sistema con control total.',
                    icon: <BarChart3 size={26} className="text-white" />,
                    bg: 'bg-[#2a1040]',
                    textColor: 'text-white',
                    descColor: 'text-white/60',
                },
                ].map((role) => (
                <div
                    key={role.title}
                    className={`card-item ${role.bg} rounded-3xl p-10 flex flex-col justify-between min-h-[300px] hover:-translate-y-1 transition-transform`}
                >
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-8">
                    {role.icon}
                    </div>
                    <div>
                    <h3 className={`${role.textColor} font-black text-2xl mb-3`}>{role.title}</h3>
                    <p className={`${role.descColor} text-sm leading-relaxed`}>{role.desc}</p>
                    </div>
                </div>
                ))}
            </div>
        </section>
    );
}