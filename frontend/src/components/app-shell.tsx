'use client';

import { SidebarProvider } from '@/components/ui/sidebar';
import { type ReactNode } from 'react';

interface AppShellProps {
    children: ReactNode;
    variant?: 'header' | 'sidebar';
}

export function AppShell({ children, variant = 'header' }: AppShellProps) {
    // bg-slate-50: Gris muy suave en modo claro
    // dark:bg-background: Vuelve al negro/oscuro de siempre en modo oscuro
    const shellClasses = "flex min-h-screen w-full bg-secondary-bg text-foreground transition-colors duration-300";

    if (variant === 'header') {
        return <div className={shellClasses}>{children}</div>;
    }

    return (
        <SidebarProvider>
            <div className={shellClasses}>
                {children}
            </div>
        </SidebarProvider>
    );
}