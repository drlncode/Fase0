import { useLocation, useNavigate } from 'react-router';
import { Fase0Logo } from '@shared/components/ui/Fase0Logo';
import { ArrowLeftIcon } from '@/shared/components/ui/Icons';

export default function NotFound() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const handleGoHome = () => navigate('/', { replace: true });

    return (
        <>
            <title>Página no encontrada | Fase0</title>
            <main
                role='main'
                className='animate-page-enter flex min-h-screen w-full flex-col items-center justify-center gap-8 overflow-x-hidden bg-base p-4 select-none sm:p-6 dark:bg-base dark:text-secondary'
            >
                <Fase0Logo color='white' className='w-24' />

                <section
                    aria-labelledby='not-found-title'
                    className='flex w-full max-w-md flex-col items-center gap-5 rounded-xl border border-default bg-surface p-6 text-center sm:p-8'
                >
                    <h1
                        aria-hidden='true'
                        className='text-7xl font-extrabold tracking-tight text-primary sm:text-8xl'
                    >
                        404
                    </h1>

                    <div className='flex flex-col items-center gap-1.5'>
                        <span className='text-[11px] font-semibold tracking-[0.2em] text-muted uppercase'>
                            Página no encontrada
                        </span>
                        <h2
                            id='not-found-title'
                            className='text-xl font-bold text-balance text-primary sm:text-2xl'
                        >
                            Esta página no existe
                        </h2>
                        <p className='max-w-sm text-sm text-balance text-secondary'>
                            La ruta
                            {' '}
                            <code className='rounded bg-overlay px-1.5 py-0.5 font-mono text-xs text-primary'>
                                {pathname}
                            </code>
                            {' '}
                            no se encuentra disponible en la aplicación.
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
