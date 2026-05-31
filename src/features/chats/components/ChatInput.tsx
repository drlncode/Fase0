import { useState, useRef, useEffect, useId } from 'react';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { useChatStore } from '@chats/store/useChatStore';
import { useMessageStore } from '@messages/store/useMessageStore';
import { useCreateMessage } from '@messages/hooks/useCreateMessage';
import { useUpdateMessage } from '@messages/hooks/useUpdateMessage';
import { isDeletedMessage } from '@messages/utils/isDeletedMessage';
import { ArrowUpIcon, CrossIcon, CornerDownLeftIcon } from '@/shared/components/ui/Icons';

export function ChatInput() {
    const id = useId();
    const inputRef = useRef<HTMLInputElement>(null);
    const [ message, setMessage ] = useState('');
    const onReplyMessage = useChatStore(state => state.onReplyMessage);
    const onEditMessage = useChatStore(state => state.onEditMessage);
    const setOnEditMessage = useChatStore(state => state.setOnEditMessage);
    const activeChat = useChatStore(state => state.activeChat);
    const setOnReplyMessage = useChatStore(state => state.setOnReplyMessage);
    const { status: createStatus, create } = useCreateMessage();
    const { update } = useUpdateMessage();
    const currentUserId = useValidAuth().user._id;

    const replyMessage = onReplyMessage
        ? useMessageStore.getState().getChatState(onReplyMessage.chatId)?.messages.find(m => m._id === onReplyMessage.messageId)
        : null;

    const isSending = createStatus.status === 'loading';
    const isEmpty = message.trim() === '';

    const dispatchFocusInput = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }

    useEffect(() => {
        dispatchFocusInput();
    }, [onReplyMessage]);

    useEffect(() => {
        if (onEditMessage) {
            setMessage(onEditMessage.message.content);
            dispatchFocusInput();
        }
    }, [onEditMessage]);

    const perfomCreateMessage = () => {
        if (isEmpty || isSending || !activeChat) return;

        if (onEditMessage) {
            update(onEditMessage.chatId, onEditMessage.message._id, { content: message.trim() });
            setOnEditMessage(null);
        } else {
            create(
                {
                    content: message.trim(),
                    chatId: activeChat._id,
                    replyTo: onReplyMessage?.messageId ?? null,
                },
                onReplyMessage && replyMessage ? {
                    replyToSenderUsername: replySenderName,
                    replyToContent: isDeletedMessage(replyMessage) ? 'Mensaje eliminado' : replyMessage.content,
                } : undefined,
            );
            if (onReplyMessage) {
                setOnReplyMessage(null);
            }
        }

        setMessage('');
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        perfomCreateMessage();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            perfomCreateMessage();
        }
    };

    const handleCancelReply = () => {
        setOnReplyMessage(null);
        dispatchFocusInput();
    };

    const handleCancelEdit = () => {
        setOnEditMessage(null);
        dispatchFocusInput();
    }

    const replySenderName = replyMessage
        ? replyMessage.senderId === currentUserId
            ? 'Tú'
            : activeChat
                ? `@${activeChat.participant.username}`
                : 'Usuario'
        : null;

    const replyContent = replyMessage
        ? (isDeletedMessage(replyMessage) ? 'Mensaje eliminado' : replyMessage.content)
        : '';

    return (
        <div className='shrink-0 px-10 pb-3'>
            {onReplyMessage && replyMessage && (
                <div className='mb-1 flex flex-col gap-1.5 overflow-hidden rounded-t-lg border border-b-0 border-default bg-overlay px-2.5 py-2 text-xs'>
                    <div className='flex min-w-0 items-center gap-1.5 text-secondary'>
                        <span className='shrink-0'>
                            <CornerDownLeftIcon size={16} />
                        </span>
                        <span className='truncate'>Respondiendo a:</span>
                        <button
                            type='button'
                            onClick={handleCancelReply}
                            className='ml-auto shrink-0 rounded p-0.5 transition-colors hover:cursor-pointer hover:text-primary'
                            aria-label='Cancelar respuesta'
                        >
                            <CrossIcon size={16} />
                        </button>
                    </div>
                    <div className='flex min-w-0 items-baseline gap-2 pl-5'>
                        <span className='shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary'>
                            {replySenderName}
                        </span>
                        <span className='min-w-0 truncate text-secondary'>{replyContent}</span>
                    </div>
                </div>
            )}
            {onEditMessage && (
                <div className='mb-1 flex flex-col gap-1.5 overflow-hidden rounded-t-lg border border-b-0 border-default bg-overlay px-2.5 py-2 text-xs'>
                    <div className='flex min-w-0 items-center gap-1.5 text-secondary'>
                        <span className='shrink-0'>
                            <CornerDownLeftIcon size={16} />
                        </span>
                        <span className='truncate'>Editando mensaje:</span>
                        <button
                            type='button'
                            onClick={handleCancelEdit}
                            className='ml-auto shrink-0 rounded p-0.5 transition-colors hover:cursor-pointer hover:text-primary'
                            aria-label='Cancelar edición'
                        >
                            <CrossIcon size={16} />
                        </button>
                    </div>
                </div>
            )}
            <form
                onSubmit={handleSubmit}
                className={`flex rounded-lg border border-default bg-overlay px-1.5 py-2 text-sm ${onReplyMessage ? 'rounded-t-none' : ''}`}
            >
                <div className='ml-1.5 flex flex-1'>
                    <input
                        id={id}
                        type='text'
                        ref={inputRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isSending}
                        placeholder='Escribe un mensaje...'
                        className='w-full outline-0 placeholder:text-muted disabled:opacity-50'
                        autoComplete='off'
                    />
                </div>
                <button
                    type='submit'
                    disabled={isEmpty || isSending}
                    className='ml-5 shrink-0 cursor-pointer rounded-lg bg-subtle p-2 transition-opacity disabled:cursor-not-allowed disabled:opacity-50'
                    aria-label='Enviar mensaje'
                >
                    <ArrowUpIcon size={20} />
                </button>
            </form>
        </div>
    );
}
