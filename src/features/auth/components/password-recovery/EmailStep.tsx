import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation('auth');
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
                    label={t('pwRecovery.init.field.label')}
                    type='email'
                    placeholder={t('pwRecovery.init.field.placeholder')}
                    required
                    registration={register('email', {
                        required: t('pwRecovery.init.field.required'),
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: t('pwRecovery.init.field.pattern')
                        }
                    })}
                    error={errors.email?.message || (state.status === 'error' ? state.message : '')}
                />
                <SubmitButton disabled={state.status === 'loading'}>
                    {state.status === 'loading' && <SpinLoader size={20} />}
                    {t('pwRecovery.init.submit')}
                </SubmitButton>
            </Form>
        </FormProvider>
    );
}
