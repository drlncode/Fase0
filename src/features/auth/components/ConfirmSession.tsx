import { useEffect } from 'react';
import { useAuthFlow } from '@auth/hooks/useAuthFlow';
import { useRefreshSession } from '@auth/hooks/useRefreshSession';
import { FormProvider, useForm } from 'react-hook-form';
import { FormContainer } from '@auth/components/FormContainer';
import { Form } from '@auth/components/Form';
import { TextField } from '@/shared/components/TextField';
import { SpinLoader } from '@shared/components/ui/SpinLoader';
import { SubmitButton } from '@/shared/components/ui/SubmitButton';

type SignInFormValues = {
    code: number;
}

export default function ConfirmSession() {
    const methods = useForm<SignInFormValues>();
    const { state, refresh, refreshState } = useRefreshSession();
    const { goToStep } = useAuthFlow();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = methods;;

    useEffect(() => {
        if (state.status === 'success') goToStep('done');
    }, [state.status, goToStep]);

    const onSubmit = async (data: SignInFormValues) => {
        refreshState();
        const code = Number(data.code);

        await refresh(code);
    };

    return (
        <FormContainer
            title='Confirme su inicio de sesión'
            label='Ingrese el código que se le envió a su correo.'
        >
            <FormProvider { ...methods }>
                <Form className='relative flex flex-col gap-3.5' onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        label='Código de confirmación'
                        type='number'
                        placeholder='Ingrese su código de confirmación'
                        required
                        registration={register('code', {
                            required: 'El código de confirmación es obligatorio',
                        })}
                        error={errors.code?.message || (state.status === 'error' ? state.message : '')}
                    />
                    <SubmitButton disabled={(state.status === 'loading')}>
                        { state.status === 'loading' && <SpinLoader size={20} /> }
                        Confirmar
                    </SubmitButton>
                </Form>
            </FormProvider>
        </FormContainer>
    );
}
