import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation('auth');
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
            title={t('confirmSession.title')}
            label={t('confirmSession.label')}
        >
            <FormProvider { ...methods }>
                <Form className='relative flex flex-col gap-3.5' onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        label={t('confirmSession.code.label')}
                        type='number'
                        placeholder={t('confirmSession.code.placeholder')}
                        required
                        registration={register('code', {
                            required: t('confirmSession.code.required'),
                        })}
                        error={errors.code?.message || (state.status === 'error' ? state.message : '')}
                    />
                    <SubmitButton disabled={(state.status === 'loading')}>
                        { state.status === 'loading' && <SpinLoader size={20} /> }
                        {t('confirmSession.submit')}
                    </SubmitButton>
                </Form>
            </FormProvider>
        </FormContainer>
    );
}
