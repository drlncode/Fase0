import { FormProvider } from 'react-hook-form';
import { Form } from '@auth/components/Form';
import { TextField } from '@/shared/components/TextField';
import { SpinLoader } from '@shared/components/ui/SpinLoader';
import { SubmitButton } from '@/shared/components/ui/SubmitButton';
import type { UseFormReturn } from 'react-hook-form';
import type { ActionHookState } from '@/shared/types/global.types';

type EmailFormValues = {
    email: string;
}

interface EmailStepProps {
    form: UseFormReturn<EmailFormValues>;
    state: ActionHookState<'OK'>;
    onSubmit: (data: EmailFormValues) => Promise<void>;
}

export function EmailStep({ form, state, onSubmit }: EmailStepProps) {
    const { register, handleSubmit, formState: { errors } } = form;

    return (
        <FormProvider
            { ...form }
        >
            <Form
                className='relative flex flex-col gap-3.5'
                onSubmit={handleSubmit(onSubmit)}
            >
                <TextField
                    label='Confirmar correo'
                    type='email'
                    placeholder='Ingrese su correo electrónico'
                    required
                    registration={register('email', {
                        required: 'El correo electrónico es obligatorio',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Ingrese un correo electrónico válido'
                        }
                    })}
                    error={errors.email?.message || (state.status === 'error' ? state.message : '')}
                />
                <SubmitButton disabled={state.status === 'loading'}>
                    {state.status === 'loading' && <SpinLoader size={20} />}
                    Enviar código
                </SubmitButton>
            </Form>
        </FormProvider>
    );
}
