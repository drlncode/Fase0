import { isDeletedMessage } from '@messages/utils/isDeletedMessage';
import { MessageReply } from '@messages/components/MessageReply';
import { VisibleMessageContent } from '@messages/components/VisibleMessageContent';
import { DeletedMessageContent } from '@messages/components/DeletedMessageContent';
import { CornerDownLeftIcon } from '@/shared/components/ui/Icons';
import { cn } from '@shared/utils/cn';

import type { OptimisticMessage, StoreMessage } from '@messages/types/message.types';

interface MessageContentProps {
    message: StoreMessage;
    side: 'received' | 'sent';
}

function isOptimistic(message: StoreMessage): message is OptimisticMessage {
    return message.status === 'SENDING';
}

export function MessageContent({ message, side }: MessageContentProps) {
    const optimistic = isOptimistic(message);

    return (
        <div className='flex min-w-0 flex-col overflow-hidden'>
            {optimistic && message.replyToMessageId && message.replyToSenderUsername && (
                <div className={cn('mb-1.5 flex min-w-0 items-center gap-1.5 overflow-hidden rounded border-l-2 border-primary/30 px-2 py-1 text-xs', side === 'sent' ? 'bg-overlay' : 'bg-subtle')}>
                    <span className='shrink-0 text-primary'>
                        <CornerDownLeftIcon size={14} />
                    </span>
                    <span className='min-w-0 shrink-0 font-medium text-secondary'>@{message.replyToSenderUsername}</span>
                    <p className='min-w-0 truncate text-secondary/75'>{message.replyToContent}</p>
                </div>
            )}
            {!optimistic && !isDeletedMessage(message) && message.replyToMessageId && (
                <MessageReply replyToMessageId={message.replyToMessageId} chatId={message.chatId} side={side} />
            )}
            {optimistic
                ? <VisibleMessageContent content={message.content} />
                : isDeletedMessage(message)
                    ? <DeletedMessageContent />
                    : <VisibleMessageContent content={message.content} />
            }
        </div>
    );
}
