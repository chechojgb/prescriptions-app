'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type PropsWithChildren } from 'react';

// Definimos la interfaz localmente si no quieres importar de @/types
interface NavItem {
    title: string;
    href: string;
}

const sidebarNavItems: NavItem[] = [
    {
        title: 'Perfil',
        href: '/settings/profile',
    },
    {
        title: 'Contraseña',
        href: '/settings/password',
    },
    {
        title: 'Apariencia',
        href: '/settings/appearance',
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const pathname = usePathname();

    return (
        <div className="">
            <div className="mb-8">
                <Heading 
                    title="Configuración" 
                    description="Gestiona tu perfil y los ajustes de tu cuenta en RxSystem" 
                />
            </div>

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full lg:w-64">
                    <nav className="flex flex-row lg:flex-col lg:space-y-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 gap-2 lg:gap-0">
                        {sidebarNavItems.map((item) => {
                            const isActive = pathname === item.href;
                            
                            return (
                                <Button
                                    key={item.href}
                                    size="sm"
                                    variant="ghost"
                                    asChild
                                    className={cn(
                                        'w-full justify-start rounded-xl transition-all',
                                        isActive 
                                            ? 'bg-[#371851]/10 text-[#371851] dark:bg-white/10 dark:text-white font-bold' 
                                            : 'text-muted-foreground hover:bg-[#371851]/5 dark:hover:bg-white/5'
                                    )}
                                >
                                    <Link href={item.href}>
                                        {item.title}
                                    </Link>
                                </Button>
                            );
                        })}
                    </nav>
                </aside>

                <Separator className="my-6 lg:hidden" />

                <div className="flex-1">
                    <section className="max-w-3xl animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}