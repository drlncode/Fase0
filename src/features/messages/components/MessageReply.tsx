import { useEffect, useRef, useState } from 'react';
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
    const [ messageRepliedState, setMessageRepliedState ] = useState<
        | { message: PublicMessage | DeletedMessage, senderUsername: string } 
        | null
        | 'searching'
    >('searching');
    const activeChat = useChatStore(state => state.activeChat);
    const { status: authStatus, user: { _id: currentUserId, session } } = useValidAuth();
    const fetchIdRef = useRef(0);

    useEffect(() => {
        if (!replyToMessageId || !chatId || !activeChat || activeChat._id !== chatId) {
            setMessageRepliedState(null);
            return;
        }

        const chatMessages = useMessageStore.getState().getChatState(chatId);

        if (!chatMessages) {
            if (authStatus === 'valid' && session) {
                const fetchId = ++fetchIdRef.current;
                getMessageById(session, chatId, replyToMessageId).then(result => {
                    if (fetchId !== fetchIdRef.current) return;
                    if (result.success) {
                        const senderUsername = result.data.senderId === currentUserId ? 'Tú' : `@${activeChat.participant.username}`;
                        setMessageRepliedState({ message: result.data, senderUsername });
                    } else {
                        setMessageRepliedState(null);
                    }
                });
            }
            return;
        }

        const messageReplied = chatMessages.messages.find(m => m._id === replyToMessageId);

        if (!messageReplied) {
            if (authStatus === 'valid' && session) {
                const fetchId = ++fetchIdRef.current;
                getMessageById(session, chatId, replyToMessageId).then(result => {
                    if (fetchId !== fetchIdRef.current) return;
                    if (result.success) {
                        const senderUsername = result.data.senderId === currentUserId ? 'Tú' : `@${activeChat.participant.username}`;
                        setMessageRepliedState({ message: result.data, senderUsername });
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

        const senderUsername = messageReplied.senderId === currentUserId ? 'Tú' : `@${activeChat.participant.username}`;
        setMessageRepliedState({ message: messageReplied as VisibleMessage, senderUsername });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeChat, chatId, replyToMessageId, authStatus, session]);

    if (messageRepliedState === 'searching') return <SpinLoader size={16} />;
    if (!messageRepliedState) return null;

    return (
        <div className={cn('mb-1 flex min-w-0 items-center gap-1.5 overflow-hidden rounded-xs border-l-2 border-primary/30 px-2 py-1 text-xs', side === 'sent' ? 'bg-overlay' : 'bg-subtle')}>
            <span className='shrink-0 text-primary'>
                <CornerDownLeftIcon size={14} />
            </span>
            {(messageRepliedState && !isDeletedMessage(messageRepliedState.message))
                ? (
                    <span className='min-w-0 shrink-0 font-medium text-secondary'>{messageRepliedState.senderUsername}</span>
                ) : (
                    <span className='italic'>Mensaje eliminado</span>
                )
            }
            {messageRepliedState && !isDeletedMessage(messageRepliedState.message) && (
                <p className='min-w-0 truncate text-secondary/75'>{messageRepliedState.message.content}</p>
            )}
        </div>
    );
}
