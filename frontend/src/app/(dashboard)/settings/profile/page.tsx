'use client';

import { useState, useTransition, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Transition } from '@headlessui/react';

// IMPORTANTE: Importamos tu hook de autenticación
import { useAuth } from "@/context/AuthContext";

import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const profileSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    email: z.string().email("Correo electrónico inválido"),
});

type ProfileValues = z.infer<typeof profileSchema>;

export default function ProfileForm() {
    // 1. Obtenemos el usuario del contexto global
    const { user, loading } = useAuth();
    const [isPending, startTransition] = useTransition();
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: '',
            email: '',
        },
    });

    // 2. Efecto para llenar el formulario en cuanto 'user' deje de ser null
    useEffect(() => {
        if (user) {
            reset({
                name: user.name,
                email: user.email,
            });
        }
    }, [user, reset]);

    const onSubmit = async (values: ProfileValues) => {
    setRecentlySuccessful(false);
    
    startTransition(async () => {
        try {
            // 1. Verificación de seguridad
            if (!user?.id) return;

            // 2. CONSTRUCCIÓN LIMPIA DE LA URL
            // Asegúrate de que NEXT_PUBLIC_API_URL sea http://localhost:3001 (o tu puerto de Nest)
            const baseUrl = process.env.NEXT_PUBLIC_API_URL; 
            const url = `${baseUrl}/users/${user.id}`;

            console.log("Llamando a:", url); // Esto debería decir http://localhost:3001/users/id...

            const response = await fetch(url, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error del servidor:", errorText);
                throw new Error('Error al actualizar');
            }

            setRecentlySuccessful(true);
            setTimeout(() => setRecentlySuccessful(false), 3000);

        } catch (error) {
            console.error("Error capturado:", error);
        }
    });
};

    // 3. Mientras carga el auth, podemos mostrar un esqueleto o nada
    if (loading) return <div className="animate-pulse">Cargando perfil...</div>;

    return (
        <div className="space-y-6">
            <HeadingSmall 
                title="Profile information" 
                description="Update your name and email address" 
            />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        {...register("name")}
                        id="name"
                        className="mt-1 block w-full"
                        placeholder="Full name"
                    />
                    <InputError className="mt-2" message={errors.name?.message} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                        {...register("email")}
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        placeholder="Email address"
                    />
                    <InputError className="mt-2" message={errors.email?.message} />
                </div>

                <div className="flex items-center gap-4">
                    <Button disabled={isPending || !user}>
                        {isPending ? 'Saving...' : 'Save'}
                    </Button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-green-600">Saved</p>
                    </Transition>
                </div>
            </form>
        </div>
    );
}