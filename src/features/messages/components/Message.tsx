import { useState, useEffect, useRef } from 'react';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { useChatStore } from '@/features/chats/store/useChatStore';
import { useUpdateMessage } from '@messages/hooks/useUpdateMessage';
import { useCountdown } from '@shared/hooks/useCountdown';
import { useModal } from '@shared/hooks/useModal';
import { useToast } from '@shared/hooks/useToast';
import { cn } from '@shared/utils/cn';
import { Countdown } from '@shared/components/Countdown';
import { MessageContent } from '@messages/components/MessageContent';
import { MessageTail } from '@messages/components/MessageTail';
import { MessageWrapper } from '@messages/components/MessageWrapper';
import { MessageBubble } from '@messages/components/MessageBubble';
import { MessageInfo } from '@/features/messages/components/MessageInfo';
import { MessageDropdown } from '@messages/components/MessageDropdown';
import { MessageDropdownItem } from '@messages/components/MessageDropdownItem';
import { DropdownDivider } from '@/shared/components/Dropdown';
import { isDeletedMessage } from '@messages/utils/isDeletedMessage';
import { CornerDownLeftIcon, ClipboardIcon, ClipboardCheckIcon, PencilIcon, TrashIcon } from '@/shared/components/ui/Icons';
import { readMarkerDebouncer } from '@messages/lib/readMarkerDebouncer';

import type { StoreMessage, OptimisticMessage } from '@messages/types/message.types';

function isOptimistic(message: StoreMessage): message is OptimisticMessage {
    return message.status === 'SENDING';
}

interface MessageProps {
    message: StoreMessage;
    side: 'received' | 'sent';
    firstOfGroup: boolean;
}

export function Message({ message, side, firstOfGroup }: MessageProps) {
    const { user: { _id: currentUserId, session } } = useValidAuth();
    const isSender = currentUserId === message.senderId;
    const [ copied, setCopied ] = useState(false);
    const { status: { status: updateStatus }, update } = useUpdateMessage();
    const { openConfirm } = useModal();
    const { success } = useToast();
    const isOptimisticMsg = isOptimistic(message);
    const validToDelete = !isOptimisticMsg && !isDeletedMessage(message) && message.deletableUntil > Date.now();
    const validToEdit = !isOptimisticMsg && !isDeletedMessage(message) && message.editInfo.editableUntil > Date.now();
    const { isPending: isTimeRemainingForDelete } = useCountdown((() => {
        if (validToDelete && !isOptimisticMsg) return message.deletableUntil;
        return null;
    })());
    const { isPending: isTimeRemainingForEdit } = useCountdown((() => {
        if (validToEdit && !isOptimisticMsg) return message.editInfo.editableUntil;
        return null;
    })());

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
                    readMarkerDebouncer.register(session, message._id);
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [side, message.status, message._id, message.chatId, session]);

    const handleCopy = () => {
        if (isDeletedMessage(message) || isOptimisticMsg) return;
        navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    const handleEdit = () => {
        if (isDeletedMessage(message) || isOptimisticMsg) return; 
        
        useChatStore.getState().setOnEditMessage({ chatId: message.chatId, message });
    }

    const handleReply = () => {
        useChatStore.getState().setOnReplyMessage({ chatId: message.chatId, messageId: message._id });
    }

    const handleDeleteForMe = () => {
        openConfirm({
            title: 'Eliminar para mi',
            message: '¿Estás seguro de que quieres eliminar este mensaje para ti? Esta acción no se puede deshacer.',
            confirmText: 'Eliminar',
            onConfirm: () => update(message.chatId, message._id, { deleted: true }),
            onSuccess: () => success('Mensaje eliminado para ti.'),
            awaitedAction: true,
            danger: true
        });
    }

    const handleDeleteForEveryone = () => {
        openConfirm({
            title: 'Eliminar para todos',
            message: '¿Estás seguro de que quieres eliminar este mensaje para todos? Esta acción no se puede deshacer.',
            confirmText: 'Eliminar',
            onConfirm: () => update(message.chatId, message._id, { deletedDef: true }),
            onSuccess: () => success('Mensaje eliminado para todos.'),
            awaitedAction: true,
            danger: true
        });
    }
    
    return (
        <MessageWrapper className='group/message' side={side}>
            <div ref={messageRef} className='relative w-fit max-w-[80%] min-w-0'>
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
                <MessageDropdown className='min-w-42.5' side={side}>
                    { !isOptimisticMsg && !isDeletedMessage(message) && (
                        <>
                            <MessageDropdownItem
                                icon={<CornerDownLeftIcon size={16} />}
                                label='Responder'
                                onClick={handleReply}
                            />
                            {(isTimeRemainingForEdit && isSender) && (
                                <>
                                    <MessageDropdownItem
                                        icon={<PencilIcon size={16} />}
                                        label={
                                            <span className='flex w-full flex-1 items-center justify-between gap-2.5'>
                                                <span>Editar</span>
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
                                label={ copied ? 'Copiado' : 'Copiar' }
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
                                label='Eliminar para mí'
                                danger
                                onClick={handleDeleteForMe}
                                disabled={updateStatus === 'loading'}
                            />
                            {(isSender && validToDelete && isTimeRemainingForDelete) && (
                                <MessageDropdownItem
                                    icon={<TrashIcon size={16} />}
                                    label={
                                        <span className='flex items-center justify-between gap-2.5'>
                                            <span>Eliminar para todos</span>
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
            </div>
        </MessageWrapper>
    );
}
