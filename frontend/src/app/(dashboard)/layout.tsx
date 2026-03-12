import AppLayoutTemplate from '@/components/layouts/app/app-sidebar-layout';
import { type ReactNode } from 'react';
import { Toaster } from "sileo";
import { AuthProvider } from '@/context/AuthContext';

// Definimos los breadcrumbs base para el dashboard
const dashboardBreadcrumbs = [
    { title: 'RxSystem', href: '/dashboard' }
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <AppLayoutTemplate breadcrumbs={dashboardBreadcrumbs}>
                <Toaster 
                    position="top-center"
                    options={{
                        // Usamos el color de tu empresa para el fondo del toast
                        fill: "var(--toast-bg)"
                    }}
                />
                {children}
            </AppLayoutTemplate>
        </AuthProvider>
    );
}