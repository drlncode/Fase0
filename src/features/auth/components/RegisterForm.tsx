import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import debounce from 'just-debounce-it';
import { FormProvider, useForm } from 'react-hook-form';
import { useAuthFlow } from '@auth/hooks/useAuthFlow';
import { usePasswordStrength } from '@auth/hooks/usePasswordStrength';
import { useGetUsernameAvailability } from '@/features/users/hooks/useGetUsernameAvailability';
import { useInvalidAuth } from '@auth/hooks/useInvalidAuth';
import { FormContainer } from '@auth/components/FormContainer';
import { Form } from '@auth/components/Form';
import { TextField } from '@shared/components/TextField';
import { SubmitButton } from '@shared/components/ui/SubmitButton';
import { UsernameAvailability } from '@auth/components/UsernameAvailability';
import { PasswordStrengthIndicator } from '@auth/components/PasswordStrengthIndicator'; 
import { SpinLoader } from '@shared/components/ui/SpinLoader';

type SignUpFormValues = {
    name: string;
    username: string;
    email: string;
    password: string;
}

export default function RegisterForm() {
    const { t } = useTranslation('auth');
    const [ error, setError ] = useState<string | null>(null);
    const { strength, fullStrength, update } = usePasswordStrength();
    const { email, goToStep } = useAuthFlow();
    const methods = useForm<SignUpFormValues>({
        mode: 'onChange',
        reValidateMode: 'onChange'
    });
    const { state, resetState, checkUsernameAvailability } = useGetUsernameAvailability();
    const loading = useRef<boolean>(false);
    const debouncedCheckUsername = useRef(
        debounce(checkUsernameAvailability, 1000)
    ).current;
    const { signup } = useInvalidAuth();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = methods;
    const cUsername = watch('username', '');
    const usernameRegExp = /[^a-zA-Z0-9._-]/g;

    const handleSignUp = async (data: SignUpFormValues) => {
        setError(null);
        if (!fullStrength  || state.status !== 'success') return;

        loading.current = true;
        const result = await signup({
            ...data,
            username: data.username.toLowerCase()
        });

        if (!result.success) {
            const { error } = result;
            setError(typeof error === 'string' ? error : error.message);
        }

        loading.current = false;
    }

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanatizedValue = e.target.value.replace(usernameRegExp, '').toLowerCase();

        setValue('username', sanatizedValue, {
            shouldValidate: true,
            shouldDirty: true
        });

        if (sanatizedValue.length < 4 || cUsername === sanatizedValue) return;

        resetState();
        debouncedCheckUsername(sanatizedValue);
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = update(e.target.value.toLowerCase());

        setValue('password', value, {
            shouldValidate: true,
            shouldDirty: true
        });
    }

    return (
        <FormContainer
            title={t('register.title')}
            label={t('register.label')}
            className='pt-[6vh] pb-[10vh]'
            backButton={{
                label: email,
                handleBack: () => goToStep('email-input')
            }}
        >
            <FormProvider { ...methods }>
                <Form className='flex flex-col gap-2' onSubmit={handleSubmit(handleSignUp)}>
                    <input type="hidden" { ...register('email') } value={email} />
                    <TextField
                        label={t('register.name.label')}
                        placeholder={t('register.name.placeholder')}
                        type='text'
                        autoComplete='name'
                        required
                        registration={register('name', {
                            required: t('register.name.required'),
                            maxLength: {
                                value: 50,
                                message: t('register.name.maxLength')
                            }
                        })}
                        error={errors.name?.message}
                    />
                    <div>
                        <TextField
                            label={t('register.username.label')}
                            placeholder={t('register.username.placeholder')}
                            type='text'
                            autoComplete='username'
                            required
                            registration={register('username', {
                                required: t('register.username.required'),
                                minLength: {
                                    value: 4,
                                    message: t('register.username.minLength')
                                },
                                maxLength: {
                                    value: 20,
                                    message: t('register.username.maxLength')
                                },
                                onChange: handleUsernameChange
                            })}
                            info={t('register.username.info')}
                            error={errors.username?.message}
                        />
                        <UsernameAvailability state={state} currentLenght={cUsername.length} />
                    </div>
                    <TextField
                        label={t('register.password.label')}
                        placeholder={t('register.password.placeholder')}
                        type='password'
                        autoComplete='new-password'
                        required
                        registration={register('password', {
                            required: t('register.password.required'),
                            onChange: handlePasswordChange
                        })}
                        error={errors.password?.message}
                        info={t('register.password.info')}
                    />
                    <PasswordStrengthIndicator strength={strength} />
                    { error && <span className='text-red-500'>{ error }</span> }
                    <SubmitButton disabled={loading.current} className='mt-3'>
                        { loading.current ? <SpinLoader size={20} /> : t('register.submit') }
                    </SubmitButton>
                </Form>
            </FormProvider>
        </FormContainer>
    )
}
