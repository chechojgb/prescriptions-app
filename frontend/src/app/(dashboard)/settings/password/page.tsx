'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Transition } from '@headlessui/react';

import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';

const passwordSchema = z.object({
    current_password: z.string().min(1, "La contraseña actual es requerida"),
    password: z.string().min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
    password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"],
});

type PasswordValues = z.infer<typeof passwordSchema>;

export default function PasswordForm() {
    const [isPending, startTransition] = useTransition();
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);

    const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<PasswordValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            current_password: '',
            password: '',
            password_confirmation: '',
        },
    });
    console.log('errors:', errors);

    const onSubmit = async (values: PasswordValues) => {
        console.log('valores:', values);
        setRecentlySuccessful(false);

        startTransition(async () => {
            try {
                const { user } = useAuthStore.getState();
                if (!user?.id) return;

                await api.patch(`/users/${user.id}/password`, {
                    current_password: values.current_password,
                    password: values.password,
                });

                reset();
                setRecentlySuccessful(true);
                setTimeout(() => setRecentlySuccessful(false), 3000);

            } catch (error: any) {
                if (error.response?.status === 401) {
                    setError('current_password', { message: 'Contraseña actual incorrecta' });
                } else {
                    setError('password', { message: 'Error al actualizar la contraseña' });
                }
            }
        });
    };

    return (
        <div className="space-y-6">
            <HeadingSmall
                title="Actualizar contraseña"
                description="Asegúrate de usar una contraseña larga y segura"
            />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-2">
                    <Label htmlFor="current_password">Contraseña actual</Label>
                    <Input
                        {...register("current_password")}
                        id="current_password"
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        placeholder="Contraseña actual"
                    />
                    <InputError message={errors.current_password?.message} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password">Nueva contraseña</Label>
                    <Input
                        {...register("password")}
                        id="password"
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        placeholder="Nueva contraseña"
                    />
                    <InputError message={errors.password?.message} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password_confirmation">Confirmar contraseña</Label>
                    <Input
                        {...register("password_confirmation")}
                        id="password_confirmation"
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        placeholder="Confirmar contraseña"
                    />
                    <InputError message={errors.password_confirmation?.message} />
                </div>

                <div className="flex items-center gap-4">
                    <Button disabled={isPending}>
                        {isPending ? 'Guardando...' : 'Guardar contraseña'}
                    </Button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-green-600">Contraseña actualizada</p>
                    </Transition>
                </div>
            </form>
        </div>
    );
}