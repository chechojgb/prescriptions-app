'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Sun, Moon } from 'lucide-react';

export default function DarkModeDash() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Evitamos el mismatch de hidratación
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // resolvedTheme nos dice si es 'dark' o 'light' incluso si el tema es 'system'
    const isDark = resolvedTheme === 'dark';

    return (
        <SidebarMenuItem>
            <SidebarMenuButton 
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className="text-neutral-400 hover:text-[#D6AF6D] transition-colors"
            >
                {isDark ? (
                    <>
                        <Sun className="h-5 w-5 text-[#D6AF6D]" />
                        <span className="text-xs uppercase tracking-widest">Light Theme</span>
                    </>
                ) : (
                    <>
                        <Moon className="h-5 w-5" />
                        <span className="text-xs uppercase tracking-widest">Dark Theme</span>
                    </>
                )}
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}