import { FormProvider } from 'react-hook-form';
import { Form } from '@auth/components/Form';
import { TextField } from '@/shared/components/TextField';
import { SpinLoader } from '@shared/components/ui/SpinLoader';
import { SubmitButton } from '@/shared/components/ui/SubmitButton';
import type { UseFormReturn } from 'react-hook-form';
import type { ActionHookState } from '@/shared/types/global.types';

type CodeFormValues = {
    code: number;
}

interface CodeStepProps {
    form: UseFormReturn<CodeFormValues>;
    state: ActionHookState<'OK'>;
    onSubmit: (data: CodeFormValues) => Promise<void>;
}

export function CodeStep({ form, state, onSubmit }: CodeStepProps) {
    const { register, handleSubmit, formState: { errors } } = form;

    return (
        <FormProvider {...form}>
            <Form className='relative flex flex-col gap-3.5' onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    label='Código de verificación'
                    type='number'
                    placeholder='Ingrese el código recibido'
                    required
                    registration={register('code', {
                        required: 'El código es obligatorio'
                    })}
                    error={errors.code?.message || (state.status === 'error' ? state.message : '')}
                />
                <SubmitButton disabled={state.status === 'loading'}>
                    {state.status === 'loading' && <SpinLoader size={20} />}
                    Verificar código
                </SubmitButton>
            </Form>
        </FormProvider>
    );
}
