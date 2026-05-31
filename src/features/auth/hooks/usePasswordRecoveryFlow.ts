import { useEffect } from 'react';
import { useInitPasswordRecovery } from '@auth/hooks/useInitPwRecovery';
import { useVerifyPasswordRevoveryCode } from '@auth/hooks/useVerifyPwRecoveryCode';
import { useRecoverPassword } from '@auth/hooks/useRecoverPassword';
import { useAuthFlow } from '@auth/hooks/useAuthFlow';
import { useForm } from 'react-hook-form';

type EmailFormValues = {
    email: string;
}

type CodeFormValues = {
    code: number;
}

type PasswordFormValues = {
    password: string;
}

export function usePasswordRecoveryFlow() {
    const { step, goToStep, setEmail, setCode } = useAuthFlow();
    const init = useInitPasswordRecovery();
    const verify = useVerifyPasswordRevoveryCode();
    const recover = useRecoverPassword();

    const emailForm = useForm<EmailFormValues>();
    const codeForm = useForm<CodeFormValues>();
    const passwordForm = useForm<PasswordFormValues>();

    useEffect(() => {
        if (init.state.status === 'success') {
            setEmail(emailForm.getValues('email'));
            goToStep('pw-recovery-code-verify');
        }
    }, [init.state.status, emailForm, setEmail, goToStep]);

    useEffect(() => {
        if (verify.state.status === 'success') {
            setCode(Number(codeForm.getValues('code')));
            goToStep('pw-reset');
        }
    }, [verify.state.status, codeForm, setCode, goToStep]);

    useEffect(() => {
        if (recover.state.status === 'success') {
            goToStep('pw-reset-success');
        }
    }, [recover.state.status, goToStep]);

    const initRecovery = async (data: EmailFormValues) => {
        init.resetState();
        await init.initPasswordRecovery({ email: data.email });
    };

    const verifyCode = async (data: CodeFormValues) => {
        verify.resetState();
        await verify.verifyPasswordRecoveryCode({ code: Number(data.code) });
    };

    const resetPassword = async (data: PasswordFormValues, code: number) => {
        recover.resetState();
        await recover.recoverPassword({ code, password: data.password });
    };

    const goBack = () => {
        switch (step) {
            case 'pw-recovery-code-verify':
                init.resetState();
                goToStep('pw-recovery-init');
                break;
            case 'pw-reset':
                verify.resetState();
                goToStep('pw-recovery-code-verify');
                break;
        }
    };

    return {
        step,
        goBack,
        forms: {
            email: emailForm,
            code: codeForm,
            password: passwordForm
        },
        actions: {
            initRecovery,
            verifyCode,
            resetPassword
        },
        states: {
            init: init.state,
            verify: verify.state,
            recover: recover.state
        }
    };
}
