import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { FormContainer } from '@auth/components/FormContainer';
import { Form } from '@auth/components/Form';
import { TextField } from '@shared/components/TextField';
import { SubmitButton } from '@shared/components/ui/SubmitButton';
import { useInvalidAuth } from '@auth/hooks/useInvalidAuth';
import { useAuthFlow } from '@auth/hooks/useAuthFlow';
import { SpinLoader } from '@shared/components/ui/SpinLoader';

type ReceiveEmailFormValues = {
    email: string;
}

export default function ReceiveEmailForm() {
    const { t } = useTranslation('auth');
    const loading = useRef<boolean>(false);
    const methods = useForm<ReceiveEmailFormValues>();
    const { isEmailAvailable } = useInvalidAuth();
    const { email, setEmail, goToStep } = useAuthFlow();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = methods;

    const onSubmit = async ({ email }: ReceiveEmailFormValues) => {
        loading.current = true;
        const result = await isEmailAvailable({ email });
        setEmail(email);

        if (!result.success) {
            loading.current = false;

            if (typeof result.error !== 'object') {
                setError('email', { message: result.error });
                return;
            }

            setError('email', { message: result.error.message });
            return;
        }

        if (!result.isAvailable) {
            goToStep('login');
            return;
        }

        goToStep('register');
    }

    return (
        <FormContainer
            title={t('emailInput.title')}
            label={t('emailInput.label')}
        >
            <FormProvider { ...methods }>
                <Form className='flex flex-col items-start gap-5' onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        label={t('emailInput.field.label')}
                        type="email"
                        placeholder={t('emailInput.field.placeholder')}
                        autoComplete='email'
                        required
                        registration={register('email', {
                            required: t('emailInput.field.required'),
                            maxLength: {
                                value: 254,
                                message: t('emailInput.field.maxLength')
                            }
                        })}
                        defaultValue={email}
                        error={errors.email?.message}
                    />
                    <SubmitButton disabled={loading.current}>
                        { loading.current && <SpinLoader size={20} /> }
                        {t('emailInput.submit')}
                    </SubmitButton>
                </Form>
            </FormProvider>
        </FormContainer>
    );
}
