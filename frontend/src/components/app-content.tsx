import { SidebarInset } from '@/components/ui/sidebar';
import * as React from 'react';

interface AppContentProps extends React.ComponentProps<'main'> {
    variant?: 'header' | 'sidebar';
}

export function AppContent({ variant = 'header', children, ...props }: AppContentProps) {
    if (variant === 'sidebar') {
        return (
            <SidebarInset {...props}>
                {/* Añadimos un contenedor flex con:
                  p-6: 24px de separación con los bordes (Adiós letras pegadas)
                  gap-6: Espacio entre el Header y el resto del contenido
                  pt-4: Un poco menos de espacio arriba para que el Header respire bien
                */}
                <div className="flex flex-1 flex-col gap-6 p-6 pt-4">
                    {children}
                </div>
            </SidebarInset>
        );
    }

    return (
        <main className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl p-4" {...props}>
            {children}
        </main>
    );
}