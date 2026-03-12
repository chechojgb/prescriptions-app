'use client';

import { useRef, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Transition } from '@headlessui/react';

import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
    
    // Refs para manejar el foco en caso de error
    const currentPasswordRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<PasswordValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            current_password: '',
            password: '',
            password_confirmation: '',
        },
    });

    const onSubmit = async (values: PasswordValues) => {
        setRecentlySuccessful(false);
        
        startTransition(async () => {
            try {
                // Aquí llamarías a tu Server Action, ejemplo:
                // const result = await updatePasswordAction(values);
                
                console.log("Enviando cambio de contraseña...", values);
                
                // Si todo sale bien:
                reset();
                setRecentlySuccessful(true);
                setTimeout(() => setRecentlySuccessful(false), 3000);

            } catch (error: any) {
                // Lógica de enfoque basada en tu código original
                if (error.type === 'current_password') {
                    reset({ current_password: '' }, { keepValues: true });
                    currentPasswordRef.current?.focus();
                } else {
                    reset({ password: '', password_confirmation: '' }, { keepValues: true });
                    passwordRef.current?.focus();
                }
            }
        });
    };

    return (
        <div className="space-y-6">
            <HeadingSmall 
                title="Update password" 
                description="Ensure your account is using a long, random password to stay secure" 
            />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-2">
                    <Label htmlFor="current_password">Current password</Label>
                    <Input
                        {...register("current_password")}
                        id="current_password"
                        type="password"
                        ref={(e) => {
                            register("current_password").ref(e);
                            // @ts-ignore
                            currentPasswordRef.current = e;
                        }}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        placeholder="Current password"
                    />
                    <InputError message={errors.current_password?.message} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password">New password</Label>
                    <Input
                        {...register("password")}
                        id="password"
                        type="password"
                        ref={(e) => {
                            register("password").ref(e);
                            // @ts-ignore
                            passwordRef.current = e;
                        }}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        placeholder="New password"
                    />
                    <InputError message={errors.password?.message} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password_confirmation">Confirm password</Label>
                    <Input
                        {...register("password_confirmation")}
                        id="password_confirmation"
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        placeholder="Confirm password"
                    />
                    <InputError message={errors.password_confirmation?.message} />
                </div>

                <div className="flex items-center gap-4">
                    <Button disabled={isPending}>Save password</Button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-neutral-600">Saved</p>
                    </Transition>
                </div>
            </form>
        </div>
    );
}