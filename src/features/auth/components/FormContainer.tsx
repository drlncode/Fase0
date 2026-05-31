import { cn } from '@/shared/utils/cn';
import { ArrowLeftIcon } from '@/shared/components/ui/Icons';

interface FormContainerProps {
    children: React.ReactNode;
    title: string;
    label: string;
    backButton?: {
        label?: string;
        handleBack: () => void
    };
    className?: string;
}

export function FormContainer({
    children,
    title,
    label,
    backButton,
    className
}: FormContainerProps) {
    return (
        <section className={cn('flex w-90 flex-col', className)}>
            <header>
                <div className='mb-8 flex flex-col items-center gap-3 text-center'>
                    <div>
                        <img src="/fase0-logo-white.svg" alt="Fase0 logo" width="100" />
                    </div>
                    <div className='flex flex-col items-center'>
                        <h1 className='text-center text-2xl font-bold text-primary'>{ title }</h1>
                        <span className='text-sm'>{ label }</span>
                    </div>
                </div>
                { backButton &&
                    <div className='pb-3'>
                        <button
                            type="button"
                            onClick={backButton.handleBack}
                            className='group flex w-fit items-center gap-1 border-b border-b-transparent pb-0.5 text-[14px] transition-all duration-200 ease-out hover:cursor-pointer hover:border-primary/65 hover:bg-surface active:scale-[0.98] active:border-default'
                        >
                            <ArrowLeftIcon size={20} />
                            <span className='transition-all duration-250 group-hover:pl-1.5'>{ backButton.label }</span>
                        </button>
                    </div>
                }
            </header>
            { children }
        </section>
    );
}
