import { useCallback } from 'react';

export function useInitials() {
    return useCallback((fullName: string | undefined | null): string => {
        // Si no hay nombre, devolvemos un string vacío o un placeholder
        if (!fullName || typeof fullName !== 'string') return '?';

        const names = fullName.trim().split(' ');

        if (names.length === 0 || names[0] === '') return '?';
        if (names.length === 1) return names[0].charAt(0).toUpperCase();

        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    }, []);
}