import { useState } from 'react';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { createMessage } from '@messages/lib/messageActions';
import { useMessageStore } from '@messages/store/useMessageStore';
import { createOptimisticMessage } from '@messages/utils/createOptimisticMessage';

import type { ActionHookState } from '@shared/types/global.types';
import type { PublicMessage, CreateMessageBody } from '@messages/types/message.types';

interface OptimisticReplyPreview {
    replyToSenderUsername: string | null;
    replyToContent: string | null;
}

export function useCreateMessage() {
    const { status: authStatus, user } = useValidAuth();

    if (authStatus !== 'valid' || !user.session)
        throw new Error('Cannot create a message without a valid user session.');

    const [status, setStatus] = useState<ActionHookState<PublicMessage>>({ status: 'idle' });

    async function create(body: CreateMessageBody, replyPreview?: OptimisticReplyPreview) {
        const optimistic = createOptimisticMessage({
            chatId: body.chatId,
            senderId: user._id,
            content: body.content,
            replyTo: body.replyTo,
            replyToSenderUsername: replyPreview?.replyToSenderUsername ?? null,
            replyToContent: replyPreview?.replyToContent ?? null,
        });

        useMessageStore.getState().addOptimisticMessage(body.chatId, optimistic);

        const result = await createMessage(user.session, { ...body, temp_id: optimistic._id });

        if (result.success) {
            useMessageStore.getState().replaceOptimisticMessage(body.chatId, optimistic._id, result.data.message);
            setStatus({ status: 'success', data: result.data.message });
        } else {
            useMessageStore.getState().removeMessage(body.chatId, optimistic._id);
            setStatus({ status: 'error', message: 'No fue posible crear el mensaje.' });
        }
    }

    return { status, create };
}