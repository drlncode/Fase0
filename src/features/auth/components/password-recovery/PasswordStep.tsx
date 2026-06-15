import { useTranslation } from 'react-i18next';
import { FormProvider } from 'react-hook-form';
import { Form } from '@auth/components/Form';
import { TextField } from '@/shared/components/TextField';
import { SpinLoader } from '@shared/components/ui/SpinLoader';
import { SubmitButton } from '@/shared/components/ui/SubmitButton';
import { PasswordStrengthIndicator } from '@auth/components/PasswordStrengthIndicator';
import { usePasswordStrength } from '@auth/hooks/usePasswordStrength';
import type { UseFormReturn } from 'react-hook-form';
import type { ActionHookState } from '@/shared/types/global.types';

type PasswordFormValues = {
    password: string;
}

interface PasswordStepProps {
    form: UseFormReturn<PasswordFormValues>;
    state: ActionHookState<'OK'>;
    code: number;
    onSubmit: (data: PasswordFormValues, code: number) => Promise<void>;
}

export function PasswordStep({ form, state, code, onSubmit }: PasswordStepProps) {
    const { t } = useTranslation('auth');
    const { register, handleSubmit, formState: { errors } } = form;
    const { strength, fullStrength, update } = usePasswordStrength();

    return (
        <FormProvider {...form}>
            <Form className='relative flex flex-col gap-3.5' onSubmit={handleSubmit(data => onSubmit(data, code))}>
                <TextField
                    label={t('pwRecovery.reset.field.label')}
                    type='password'
                    placeholder={t('pwRecovery.reset.field.placeholder')}
                    required
                    registration={register('password', {
                        required: t('pwRecovery.reset.field.required'),
                        maxLength: {
                            value: 60,
                            message: t('pwRecovery.reset.field.maxLength')
                        },
                        onChange: e => update(e.target.value)
                    })}
                    error={errors.password?.message || (state.status === 'error' ? state.message : '')}
                    info={t('pwRecovery.reset.field.info')}
                />
                <PasswordStrengthIndicator strength={strength} />
                <SubmitButton disabled={state.status === 'loading' || !fullStrength}>
                    {state.status === 'loading' && <SpinLoader size={20} />}
                    {t('pwRecovery.reset.submit')}
                </SubmitButton>
            </Form>
        </FormProvider>
    );
}
