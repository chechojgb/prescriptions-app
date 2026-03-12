'use client';

import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { type User } from '@/types';
import Link from 'next/link';
import { LogOut, Settings } from 'lucide-react';
// import { logoutAction } from '@/app/(auth)/login/actions'; // Importamos la acción
import { logout } from '@/lib/auth';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm bg-white/5">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5" />
            
            <DropdownMenuGroup>
                <DropdownMenuItem asChild className="focus:bg-[#AF6DD6]/10 focus:text-[#AF6DD6] cursor-pointer">
                    <Link className="flex w-full items-center" href="/settings/profile">
                        <Settings className="mr-2 size-4 text-[#D6AF6D]" />
                        <span className="text-xs uppercase tracking-widest">Configuración</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator className="bg-white/5" />
            
            {/* Botón de Log out con Server Action */}
            <DropdownMenuItem 
                className="focus:bg-red-500/10 focus:text-red-400 cursor-pointer"
                onSelect={async () => {
                    await logout();
                }}
            >
                <div className="flex w-full items-center">
                    <LogOut className="mr-2 size-4" />
                    <span className="text-xs uppercase tracking-widest font-bold">Terminar Sesión</span>
                </div>
            </DropdownMenuItem>
        </>
    );
}