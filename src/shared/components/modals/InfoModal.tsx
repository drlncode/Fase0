import { useTranslation } from 'react-i18next';
import { useModalStore } from '@shared/store/useModalStore';
import { CrossIcon } from '@/shared/components/ui/Icons';
import { cn } from '@shared/utils/cn';

import type { InfoModalProps } from '@shared/types/global.types';

interface InfoModalComponentProps extends InfoModalProps {
    id: string;
}

export function InfoModal({
    title,
    content,
    fullWidth = false
}: InfoModalComponentProps) {
    const { t } = useTranslation();
    const close = useModalStore(state => state.close);

    return (
        <div className='flex h-full w-full cursor-default items-end justify-center p-0 sm:items-center sm:p-4'>
            <div
                role='dialog'
                aria-modal='true'
                aria-labelledby='modal-title'
                className={cn(
                    'animate-modal-enter relative flex max-h-[90dvh] w-full flex-col gap-4 overflow-y-auto rounded-t-xl border border-default bg-overlay p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-lg',
                    'sm:w-[calc(100vw-2rem)] sm:max-w-md sm:rounded-lg sm:p-6 sm:pb-6',
                    fullWidth && 'sm:max-w-2xl'
                )}
            >
                <button
                    type='button'
                    onClick={close}
                    className={cn(
                        'absolute top-3 right-3 cursor-pointer rounded-md p-1 text-secondary transition-colors select-none',
                        'hover:bg-subtle'
                    )}
                    aria-label={t('actions.close')}
                >
                    <CrossIcon size={20} />
                </button>
                {title && (
                    <h2 id='modal-title' className='pr-6 text-lg font-semibold text-primary'>
                        {title}
                    </h2>
                )}
                <div className='min-w-0 sm:pr-6'>
                    {content}
                </div>
            </div>
        </div>
    );
}