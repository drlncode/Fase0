import { useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormContainer } from '@auth/components/FormContainer';
import { Form } from '@auth/components/Form';
import { TextField } from '@/shared/components/TextField';
import { useInvalidAuth } from '@auth/hooks/useInvalidAuth';
import { useAuthFlow } from '@auth/hooks/useAuthFlow';
import { SpinLoader } from '@shared/components/ui/SpinLoader';
import { SubmitButton } from '@/shared/components/ui/SubmitButton';

type SignInFormValues = {
    email: string;
    password: string;
}

export default function LoginForm() {
    const methods = useForm<SignInFormValues>();
    const loading = useRef<boolean>(false);
    const { signin } = useInvalidAuth();
    const { email, goToStep } = useAuthFlow();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = methods;

    const onSubmit = async (data: SignInFormValues) => {
        setError('password', {});
        loading.current = true;

        const result = await signin(data);

        if (!result.success) {
            loading.current = false;

            if (typeof result.error === 'object') {
                if (result.error.status === 401) {
                    setError('password', {
                        message: 'Credenciales incorrectas.'
                    });

                    return;
                }
            }

            setError('password', {
                message: 'Algo salió mal. Inténtelo de nuevo mas tarde.'
            });
        }

        loading.current = false;
    };

    return (
        <FormContainer
            title='Iniciar sesión'
            label='Ingrese su contraseña para acceder.'
            backButton={{
                label: email,
                handleBack: () => goToStep('email-input')
            }}
        >
            <FormProvider { ...methods }>
                <Form className='relative flex flex-col gap-3.5' onSubmit={handleSubmit(onSubmit)}>
                    <input
                        type="text"
                        autoComplete="username"
                        style={{ display: 'none' }}
                        { ...register('email') }
                        defaultValue={email}
                    />
                    <TextField
                        label='Contraseña'
                        type='password'
                        placeholder='Ingrese su contraseña'
                        autoComplete='current-password'
                        required
                        registration={register('password', {
                            required: 'La contraseña es obligatoria',
                        })}
                        error={errors.password?.message}
                    />
                    <div className="text-right">
                        <button
                            type="button"
                            className="border-b border-b-transparent pb-0.5 text-[14px] transition-all duration-200 ease-out hover:cursor-pointer hover:border-primary/65 active:scale-[0.98] active:border-default"
                            onClick={() => goToStep('pw-recovery-init')}
                        >
                            ¿Olvidaste tu contraseña?
                        </button>
                    </div>
                    <SubmitButton disabled={loading.current}>
                        { loading.current && <SpinLoader size={20} /> }
                        Entrar
                    </SubmitButton>
                </Form>
            </FormProvider>
        </FormContainer>
    );
}
