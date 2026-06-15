import { useState } from 'react';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { useMessageStore } from '@messages/store/useMessageStore';
import { updateMessage } from '@messages/lib/messageActions';
import i18n from '@/lib/i18n';

import type { ActionHookState } from '@shared/types/global.types';
import type { VisibleMessage, UpdateMessageBody } from '@messages/types/message.types';

export function useUpdateMessage() {
    const { status: authStatus, user: { session } } = useValidAuth();
    const updateStoredMessage = useMessageStore(state => state.updateMessage);

    if (authStatus !== 'valid' || !session)
        throw new Error('Cannot update a message without a valid user session.');

    const [status, setStatus] = useState<ActionHookState<VisibleMessage>>({ status: 'idle' });

    function getSuccessMessage(body: UpdateMessageBody): string {
        if (body.deletedDef) return i18n.t('messages:toast.deletedForEveryone');
        if (body.deleted) return i18n.t('messages:toast.deleted');
        if (body.read) return i18n.t('messages:toast.markedAsRead');
        return i18n.t('messages:toast.updated');
    }

    async function update(chatId: string, messageId: string, body: UpdateMessageBody) {
        setStatus({ status: 'loading' });

        const result = await updateMessage(messageId, body);

        if (result.success) {
            if (!['deleted'].some(key => key in body)) {
                updateStoredMessage(chatId, messageId, result.data);
            }

            setStatus({ status: 'success' as const, data: result.data });
            return;
        }

        setStatus({
            status: 'error' as const,
            message: i18n.t('messages:errors.updateMessage')
        });
    }

    return {
        status,
        update,
        getSuccessMessage
    }
}