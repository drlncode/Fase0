import { useEffect, useRef } from 'react';
import { useMessageActions, isOptimisticMessage } from '@messages/hooks/useMessageActions';
import { useHorizontalSwipe } from '@shared/hooks/useHorizontalSwipe';
import { useIsCoarsePointer } from '@shared/hooks/useMediaQuery';
import { useModal } from '@shared/hooks/useModal';
import { cn } from '@shared/utils/cn';
import { Countdown } from '@shared/components/Countdown';
import { MessageContent } from '@messages/components/MessageContent';
import { MessageTail } from '@messages/components/MessageTail';
import { MessageWrapper } from '@messages/components/MessageWrapper';
import { MessageBubble } from '@messages/components/MessageBubble';
import { MessageInfo } from '@/features/messages/components/MessageInfo';
import { MessageDropdown } from '@messages/components/MessageDropdown';
import { MessageActionsSheetContent } from '@messages/components/MessageActionsSheetContent';
import { MessageDropdownItem } from '@messages/components/MessageDropdownItem';
import { DropdownDivider } from '@/shared/components/Dropdown';
import { isDeletedMessage } from '@messages/utils/isDeletedMessage';
import { CornerDownLeftIcon, ClipboardIcon, ClipboardCheckIcon, PencilIcon, TrashIcon } from '@/shared/components/ui/Icons';
import { readMarkerDebouncer } from '@messages/lib/readMarkerDebouncer';

import type { StoreMessage } from '@messages/types/message.types';

interface MessageProps {
    message: StoreMessage;
    side: 'received' | 'sent';
    firstOfGroup: boolean;
}

export function Message({ message, side, firstOfGroup }: MessageProps) {
    const {
        t,
        copied,
        updateStatus,
        isSender,
        isTimeRemainingForDelete,
        isTimeRemainingForEdit,
        handlers,
    } = useMessageActions(message);
    const { copy: handleCopy, edit: handleEdit, reply: handleReply, deleteForMe: handleDeleteForMe, deleteForEveryone: handleDeleteForEveryone } = handlers;
    const isOptimisticMsg = isOptimisticMessage(message);
    const validToDelete = !isOptimisticMsg && !isDeletedMessage(message) && message.deletableUntil > Date.now();
    const { openBottomSheet } = useModal();
    const isTouch = useIsCoarsePointer();
    const swipe = useHorizontalSwipe({
        // Own messages swipe right-to-left, received ones left-to-right (towards the center).
        allowed: side === 'sent' ? ['left'] : ['right'],
        disabled: !isTouch,
        onSwipe: () => openBottomSheet({ content: <MessageActionsSheetContent message={message} /> }),
    });

    const messageRef = useRef<HTMLDivElement>(null);
    const markAsReadAttempted = useRef(false);

    useEffect(() => {
        if (side !== 'received' || message.status !== 'SENT' || markAsReadAttempted.current) return;

        const element = messageRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !markAsReadAttempted.current) {
                    markAsReadAttempted.current = true;
                    observer.disconnect();
                    readMarkerDebouncer.register(message._id);
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [side, message.status, message._id, message.chatId]);

    return (
        <MessageWrapper className='group/message' side={side}>
            <div
                ref={messageRef}
                className='relative w-fit max-w-[85%] min-w-0 touch-pan-y transition-transform duration-200 ease-out sm:max-w-[80%]'
                style={{
                    transform: swipe.offsetX ? `translateX(${swipe.offsetX}px)` : undefined,
                    transition: swipe.isSwiping ? 'none' : undefined,
                }}
                onTouchStart={swipe.handlers.onTouchStart}
                onTouchMove={swipe.handlers.onTouchMove}
                onTouchEnd={swipe.handlers.onTouchEnd}
                onTouchCancel={swipe.handlers.onTouchCancel}
                onClickCapture={swipe.handlers.onClickCapture}
            >
                <span className={cn('absolute', {
                    'right-[98.5%] text-overlay': side === 'received',
                    'left-[98.5%] text-subtle': side === 'sent',
                })}>
                    { firstOfGroup && <MessageTail side={side} /> }
                </span>
                <MessageBubble side={side}>
                    <MessageContent message={message} side={side} />
                    <MessageInfo
                        createdAt={isOptimisticMsg ? Date.now() : message.createdAt}
                        isSender={isSender}
                        isEdited={!isOptimisticMsg && !isDeletedMessage(message) && message.editInfo.isEdited}
                        status={message.status}
                    />
                </MessageBubble>
                {!isTouch && (
                <MessageDropdown className='max-w-[calc(100vw-2rem)] min-w-42.5' side={side}>
                    { !isOptimisticMsg && !isDeletedMessage(message) && (
                        <>
                            <MessageDropdownItem
                                icon={<CornerDownLeftIcon size={16} />}
                                label={t('actions.reply')}
                                onClick={handleReply}
                            />
                            {(isTimeRemainingForEdit && isSender) && (
                                <>
                                    <MessageDropdownItem
                                        icon={<PencilIcon size={16} />}
                                        label={
                                            <span className='flex w-full flex-1 items-center justify-between gap-2.5'>
                                                <span>{t('actions.edit')}</span>
                                                {isTimeRemainingForEdit && <Countdown targetTimestamp={message.editInfo.editableUntil} className='mt-0.5 text-[10px]' />}
                                            </span>
                                        }
                                        onClick={handleEdit}
                                    />
                                    <DropdownDivider />
                                </>
                            )}
                            { !isTimeRemainingForEdit && <DropdownDivider /> }
                            <MessageDropdownItem
                                icon={copied ? <ClipboardCheckIcon size={16} /> : <ClipboardIcon size={16} />}
                                label={ copied ? t('actions.copied') : t('actions.copy') }
                                closeOnClick={false}
                                onClick={handleCopy}
                                disabled={copied}
                            />
                            <DropdownDivider />
                        </>
                    )}
                    {!isOptimisticMsg && (
                        <>
                            <MessageDropdownItem
                                icon={<TrashIcon size={16} />}
                                label={t('actions.deleteForMe')}
                                danger
                                onClick={handleDeleteForMe}
                                disabled={updateStatus === 'loading'}
                            />
                            {(isSender && validToDelete && isTimeRemainingForDelete) && (
                                <MessageDropdownItem
                                    icon={<TrashIcon size={16} />}
                                    label={
                                        <span className='flex items-center justify-between gap-2.5'>
                                            <span>{t('actions.deleteForEveryone')}</span>
                                            {isTimeRemainingForDelete && <Countdown targetTimestamp={message.deletableUntil} className='mt-0.5 text-[10px]' />}
                                        </span>
                                    }
                                    danger
                                    onClick={handleDeleteForEveryone}
                                    disabled={updateStatus === 'loading'}
                                />
                            )}
                        </>
                    )}
                </MessageDropdown>
                )}
            </div>
        </MessageWrapper>
    );
}
