import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router';
import { Fase0Logo } from '@shared/components/ui/Fase0Logo';
import { AlertTriangleIcon, ArrowLeftIcon } from '@/shared/components/ui/Icons';

export default function Error() {
    const error = useRouteError();
    const navigate = useNavigate();

    let status = 500;
    let title = 'Error inesperado';
    let message = 'Algo salió mal al procesar tu solicitud. Por favor, inténtalo de nuevo.';

    if (isRouteErrorResponse(error)) {
        status = error.status;
        title = error.statusText || `Error ${error.status}`;
        const dataMessage = typeof error.data === 'string' ? error.data : null;
        if (dataMessage) message = dataMessage;
    } else if (error instanceof Error) {
        const errMsg = (error as Error).message;
        if (errMsg) message = errMsg;
    }

    const handleGoHome = () => navigate('/', { replace: true });

    return (
        <>
            <title>{`${title} | Fase0`}</title>
            <main
                role='alert'
                aria-live='assertive'
                className='animate-page-enter flex min-h-screen w-full flex-col items-center justify-center gap-8 overflow-x-hidden bg-base p-4 select-none sm:p-6 dark:bg-base dark:text-secondary'
            >
                <Fase0Logo color='white' className='w-24' />

                <section
                    aria-labelledby='error-title'
                    className='flex w-full max-w-md flex-col items-center gap-5 rounded-xl border border-default bg-surface p-6 text-center sm:p-8'
                >
                    <div className='flex h-14 w-14 items-center justify-center rounded-full border border-danger/30 bg-danger-muted text-danger'>
                        <AlertTriangleIcon size={28} />
                    </div>

                    <div className='flex flex-col items-center gap-1.5'>
                        <span className='text-[11px] font-semibold tracking-[0.2em] text-muted uppercase'>
                            Error {status}
                        </span>
                        <h1
                            id='error-title'
                            className='text-2xl font-bold text-balance text-primary sm:text-3xl'
                        >
                            {title}
                        </h1>
                        <p className='max-w-sm text-sm text-balance text-secondary'>
                            {message}
                        </p>
                    </div>

                    <button
                        type='button'
                        onClick={handleGoHome}
                        className='mt-2 flex w-full items-center justify-center gap-2 rounded-md border border-default bg-overlay p-2.5 text-sm text-primary transition-all duration-200 ease-out hover:cursor-pointer hover:border-strong/75 hover:bg-elevated active:scale-[0.98]'
                    >
                        <ArrowLeftIcon size={16} />
                        <span>Volver al inicio</span>
                    </button>
                </section>
            </main>
        </>
    );
}
