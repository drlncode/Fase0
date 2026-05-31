import { useModalStore } from '@shared/store/useModalStore';
import type { ModalData } from '@shared/types/global.types';
import { CrossIcon } from '@/shared/components/ui/Icons';
import { cn } from '@shared/utils/cn';

interface BottomSheetProps {
    id: string;
    title?: string;
    children?: React.ReactNode;
}

export function BottomSheet({ id, title, children }: BottomSheetProps) {
    const close = useModalStore(state => state.close);
    const modals = useModalStore(state => state.modals);
    const modal = modals.find(m => m.id === id) as Extract<ModalData, { type: 'bottom-sheet' }>;

    const content = children ?? modal?.props.content;

    return (
        <div className='flex h-full w-full cursor-default flex-col items-center justify-end'>
            <div
                role='dialog'
                aria-modal='true'
                className={cn(
                    'animate-sheet-enter relative flex max-h-[80vh] w-full flex-col rounded-t-xl border-t border-default bg-overlay',
                    'shadow-xl'
                )}
            >
                <button
                    type='button'
                    onClick={close}
                    className={cn(
                        'absolute top-3 right-3 cursor-pointer rounded-md p-1 text-secondary transition-colors select-none',
                        'hover:bg-subtle'
                    )}
                    aria-label='Cerrar'
                >
                    <CrossIcon size={18} />
                </button>
                {title && (
                    <div className='border-b border-default px-4 py-3 pr-10'>
                        <h2 className='text-lg font-semibold text-primary'>{title}</h2>
                    </div>
                )}
                <div className='flex-1 overflow-y-auto p-4'>
                    {content}
                </div>
            </div>
        </div>
    );
}