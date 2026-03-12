'use client';
import { useAuth } from "@/context/AuthContext";
import Link from 'next/link'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
    FileText,
    PlusCircle,
    BarChart3,
    Users,
    Stethoscope,
} from 'lucide-react';

import AppLogo from './app-logo';
import { NavMain } from './nav-main';
import { NavFooter } from './nav-footer';
import { NavUser } from './nav-user';

const navItemsByRole = {
    admin: [
        {
            title: 'Dashboard',
            href: '/admin',
            icon: BarChart3,
        },
        {
            title: 'Prescripciones',
            href: '/admin/prescriptions',
            icon: FileText,
        },
        {
            title: 'Usuarios',
            href: '/admin/users',
            icon: Users,
        },
    ],
    doctor: [
        {
            title: 'Mis Prescripciones',
            href: '/doctor/prescriptions',
            icon: FileText,
        },
        {
            title: 'Nueva Prescripción',
            href: '/doctor/prescriptions/new',
            icon: PlusCircle,
        },
    ],
    patient: [
        {
            title: 'Mis Prescripciones',
            href: '/patient/prescriptions',
            icon: FileText,
        },
    ],
};

const footerNavItems = [
    { title: 'Inicio', href: '/', icon: Stethoscope },
];

export function AppSidebar() {
    const { user, loading } = useAuth();

    if (loading || !user) return null;

    const visibleNavItems = navItemsByRole[user.role as keyof typeof navItemsByRole] || [];

    return (
        <Sidebar collapsible="icon" variant="inset" className="border-r">
            <SidebarHeader className="p-4 pb-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/">
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={visibleNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}