import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation('auth');
    const { register, handleSubmit, formState: { errors } } = form;

    return (
        <FormProvider {...form}>
            <Form className='relative flex flex-col gap-3.5' onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    label={t('pwRecovery.codeVerify.field.label')}
                    type='number'
                    placeholder={t('pwRecovery.codeVerify.field.placeholder')}
                    required
                    registration={register('code', {
                        required: t('pwRecovery.codeVerify.field.required')
                    })}
                    error={errors.code?.message || (state.status === 'error' ? state.message : '')}
                />
                <SubmitButton disabled={state.status === 'loading'}>
                    {state.status === 'loading' && <SpinLoader size={20} />}
                    {t('pwRecovery.codeVerify.submit')}
                </SubmitButton>
            </Form>
        </FormProvider>
    );
}
