import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { useMessageStore } from '@messages/store/useMessageStore';
import { useChatStore } from '@chats/store/useChatStore';
import { getMessageById } from '@messages/lib/messageActions';
import { isDeletedMessage } from '@messages/utils/isDeletedMessage';
import { SpinLoader } from '@shared/components/ui/SpinLoader';
import { CornerDownLeftIcon } from '@/shared/components/ui/Icons';
import { cn } from '@shared/utils/cn';

import type { DeletedMessage, PublicMessage, VisibleMessage } from '@messages/types/message.types';

interface MessageReplyProps {
    replyToMessageId: string | null;
    chatId: string;
    side: 'received' | 'sent';
}

export function MessageReply({ replyToMessageId, chatId, side }: MessageReplyProps) {
    const { t } = useTranslation('messages');
    const [ messageRepliedState, setMessageRepliedState ] = useState<
        | { message: PublicMessage | DeletedMessage }
        | null
        | 'searching'
    >('searching');
    const activeChat = useChatStore(state => state.activeChat);
    const { status: authStatus, user: { _id: currentUserId } } = useValidAuth();
    const fetchIdRef = useRef(0);

    useEffect(() => {
        if (!replyToMessageId || !chatId || !activeChat || activeChat._id !== chatId) {
            setMessageRepliedState(null);
            return;
        }

        const chatMessages = useMessageStore.getState().getChatState(chatId);

        if (!chatMessages) {
            if (authStatus === 'valid') {
                const fetchId = ++fetchIdRef.current;
                getMessageById(chatId, replyToMessageId).then(result => {
                    if (fetchId !== fetchIdRef.current) return;
                    if (result.success) {
                        setMessageRepliedState({ message: result.data });
                    } else {
                        setMessageRepliedState(null);
                    }
                });
            }
            return;
        }

        const messageReplied = chatMessages.messages.find(m => m._id === replyToMessageId);

        if (!messageReplied) {
            if (authStatus === 'valid') {
                const fetchId = ++fetchIdRef.current;
                getMessageById(chatId, replyToMessageId).then(result => {
                    if (fetchId !== fetchIdRef.current) return;
                    if (result.success) {
                        setMessageRepliedState({ message: result.data });
                    } else {
                        setMessageRepliedState(null);
                    }
                });
            }
            return;
        }

        if (messageReplied.status === 'SENDING') {
            setMessageRepliedState(null);
            return;
        }

        setMessageRepliedState({ message: messageReplied as VisibleMessage });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeChat, chatId, replyToMessageId, authStatus]);

    if (messageRepliedState === 'searching') return <SpinLoader size={16} />;
    if (!messageRepliedState) return null;

    const { message } = messageRepliedState;
    const isCurrentUser = !isDeletedMessage(message) && message.senderId === currentUserId;
    const senderUsername = isCurrentUser ? t('reply.you') : activeChat ? `@${activeChat.participant.username}` : '';

    return (
        <div className={cn('mb-1 flex min-w-0 items-center gap-1.5 overflow-hidden rounded-xs border-l-2 border-primary/30 px-2 py-1 text-xs', side === 'sent' ? 'bg-overlay' : 'bg-subtle')}>
            <span className='shrink-0 text-primary'>
                <CornerDownLeftIcon size={14} />
            </span>
            {!isDeletedMessage(message)
                ? (
                    <span className='min-w-0 shrink-0 font-medium text-secondary'>{senderUsername}</span>
                ) : (
                    <span className='italic'>{t('reply.deletedMessage')}</span>
                )
            }
            {!isDeletedMessage(message) && (
                <p className='min-w-0 truncate text-secondary/75'>{message.content}</p>
            )}
        </div>
    );
}
