'use client'; // OBLIGATORIO: Usa Hooks y Dropdowns interactivos
import { useAuth } from "@/context/AuthContext";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
    SidebarMenu, 
    SidebarMenuButton, 
    SidebarMenuItem, 
    useSidebar 
} from '@/components/ui/sidebar';
import { UserInfo } from './user-info';
import { UserMenuContent } from './user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronsUpDown } from 'lucide-react';

// Recibimos 'user' como prop (inyectado desde AppSidebar)
export function NavUser() {
    const { user, loading } = useAuth();
    
    const { state } = useSidebar();
    const isMobile = useIsMobile();
    
    // 1. En lugar de retornar null, definimos un usuario por defecto si viene vacío
    const userData = user || {
        name: "Usuario Zallar",
        email: "invitado@zallar.com"
    };
    console.log('userData:', user);

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton 
                            size="lg" 
                            /* Cambiamos hover:bg-white/5 por hover:bg-sidebar-accent */
                            className="text-sidebar-foreground data-[state=open]:bg-sidebar-accent transition-colors"
                        >
                            <UserInfo user={userData} />
                            <ChevronsUpDown className="ml-auto size-4 text-[#D6AF6D]" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        /* 2. CAMBIO CRUCIAL PARA MODO CLARO/OSCURO:
                           Cambiamos bg-[#252526] y text-white por clases de sistema 
                        */
                        className="w-[220px] min-w-56 rounded-xl border-border bg-popover text-popover-foreground shadow-2xl"
                        align="end"
                        side={isMobile ? 'bottom' : state === 'collapsed' ? 'left' : 'bottom'}
                    >
                        <UserMenuContent user={userData} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}