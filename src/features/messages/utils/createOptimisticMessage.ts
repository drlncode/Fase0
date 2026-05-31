import type { OptimisticMessage } from '@messages/types/message.types';

export function createOptimisticMessage(data: {
    chatId: string;
    senderId: string;
    content: string;
    replyTo: string | null;
    replyToSenderUsername?: string | null;
    replyToContent?: string | null;
}): OptimisticMessage {
    return {
        _id: crypto.randomUUID(),
        chatId: data.chatId,
        senderId: data.senderId,
        content: data.content,
        replyToMessageId: data.replyTo,
        replyToSenderUsername: data.replyToSenderUsername ?? null,
        replyToContent: data.replyToContent ?? null,
        status: 'SENDING',
        createdAt: Date.now(),
    };
}