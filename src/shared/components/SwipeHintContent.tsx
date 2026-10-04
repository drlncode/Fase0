import { useTranslation } from 'react-i18next';
import { useModal } from '@shared/hooks/useModal';
import { MessageBubble } from '@messages/components/MessageBubble';
import { MessageTail } from '@messages/components/MessageTail';
import { MessageInfo } from '@messages/components/MessageInfo';
import { cn } from '@shared/utils/cn';
import { ArrowLeftIcon, MessageIcon, DoubleCheckIcon } from '@/shared/components/ui/Icons';

function MockChatRow() {
    return (
        <div className='animate-swipe-hint-left flex items-center gap-2.5 rounded-lg bg-subtle p-2.5 will-change-transform'>
            <div className='h-9 w-9 shrink-0 rounded-full bg-badge' />
            <div className='flex min-w-0 flex-1 flex-col gap-1.5'>
                <div className='h-2.5 w-2/5 rounded-full bg-badge' />
                <div className='h-2 w-3/5 rounded-full bg-badge' />
            </div>
        </div>
    );
}

function MockBubble({ side }: { side: 'sent' | 'received' }) {
    const animation = side === 'sent' ? 'animate-swipe-hint-left' : 'animate-swipe-hint-right';
    const isSender = side === 'sent';
    return (
        <div className={`flex w-full ${isSender ? 'justify-end' : 'justify-start'}`}>
            <div className={`${animation} relative w-fit max-w-[85%] will-change-transform`}>
                <span className={cn('absolute', {
                    'right-[98.5%] text-overlay': side === 'received',
                    'left-[98.5%] text-subtle': side === 'sent',
                })}>
                    <MessageTail side={side} />
                </span>
                <MessageBubble side={side}>
                    <span className='flex min-w-0 flex-col justify-center gap-1.5 py-0.5'>
                        <span className='h-2 w-24 rounded-full bg-badge' />
                        <span className='h-2 w-16 rounded-full bg-badge' />
                    </span>
                    <MessageInfo createdAt={Date.now()} isSender={isSender} isEdited={false} status='READ' />
                </MessageBubble>
            </div>
        </div>
    );
}

export function SwipeHintContent() {
    const { t } = useTranslation();
    const { close } = useModal();

    return (
        <div className='flex flex-col gap-4'>
            <p className='text-sm text-secondary'>{t('swipeHint.description')}</p>

            <div className='flex flex-col gap-1.5'>
                <p className='flex items-center gap-1.5 text-xs font-medium text-primary'>
                    <ArrowLeftIcon size={14} />
                    {t('swipeHint.chatsLabel')}
                </p>
                <div className='overflow-hidden rounded-lg border border-default p-1.5'>
                    <MockChatRow />
                </div>
            </div>

            <div className='flex flex-col gap-1.5'>
                <p className='flex items-center gap-1.5 text-xs font-medium text-primary'>
                    <DoubleCheckIcon size={14} />
                    {t('swipeHint.sentLabel')}
                </p>
                <div className='overflow-hidden rounded-lg border border-default bg-surface p-1.5'>
                    <MockBubble side='sent' />
                </div>
            </div>

            <div className='flex flex-col gap-1.5'>
                <p className='flex items-center gap-1.5 text-xs font-medium text-primary'>
                    <MessageIcon size={14} />
                    {t('swipeHint.receivedLabel')}
                </p>
                <div className='overflow-hidden rounded-lg border border-default bg-surface p-1.5'>
                    <MockBubble side='received' />
                </div>
            </div>

            <button
                type='button'
                onClick={close}
                className='mt-1 w-full cursor-pointer rounded-md border border-strong bg-badge/70 px-4 py-2.5 text-sm font-semibold text-primary transition-all select-none hover:brightness-125 active:scale-[0.99]'
            >
                {t('swipeHint.gotIt')}
            </button>
        </div>
    );
}
