'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Monitor, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AppearanceTabs() {
    const { theme, setTheme } = useTheme();

    const options = [
        { name: 'Claro', value: 'light', icon: Sun },
        { name: 'Oscuro', value: 'dark', icon: Moon },
        { name: 'Sistema', value: 'system', icon: Monitor },
    ];

    return (
        <div className="flex flex-wrap gap-2">
            {options.map((option) => (
                <Button
                    key={option.value}
                    variant="outline"
                    size="sm"
                    onClick={() => setTheme(option.value)}
                    className={cn(
                        "rounded-xl gap-2 transition-all",
                        theme === option.value 
                            ? "border-[#371851] bg-[#371851]/5 text-[#371851] dark:border-white dark:bg-white/10 dark:text-white" 
                            : "border-transparent opacity-60 hover:opacity-100"
                    )}
                >
                    <option.icon size={16} />
                    {option.name}
                </Button>
            ))}
        </div>
    );
}