'use client'; 

import { 
    SidebarGroup, 
    SidebarGroupLabel, 
    SidebarMenu, 
    SidebarMenuButton, 
    SidebarMenuItem 
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import Link from 'next/link'; 
import { usePathname } from 'next/navigation'; 
import DarkModeDash from './dark-modeDash';
import SidebarDropdown from './SidebarDropdown';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const pathname = usePathname();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                platform RxSystem
            </SidebarGroupLabel>
            <SidebarMenu>
                <DarkModeDash />
                {items.map((item) =>
                    item.children ? (
                        <SidebarDropdown 
                            key={item.title} 
                            item={item} 
                            currentPath={pathname} 
                        />
                    ) : (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton 
                                asChild 
                                isActive={item.href === pathname}
                                className={item.href === pathname ? "text-[#AF6DD6]" : ""}
                            >
                                <Link href={item.href}>
                                    {item.icon && <item.icon className="w-4 h-4" />}
                                    <span className="text-xs uppercase tracking-wider">
                                        {item.title}
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )
                )}
            </SidebarMenu>
        </SidebarGroup>
    );
}