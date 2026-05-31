import { useState } from 'react';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { useMessageStore } from '@messages/store/useMessageStore';
import { updateMessage } from '@messages/lib/messageActions';

import type { ActionHookState } from '@shared/types/global.types';
import type { VisibleMessage, UpdateMessageBody } from '@messages/types/message.types';

export function useUpdateMessage() {
    const { status: authStatus, user: { session } } = useValidAuth();
    const updateStoredMessage = useMessageStore(state => state.updateMessage);

    if (authStatus !== 'valid' || !session)
        throw new Error('Cannot update a message without a valid user session.');

    const [status, setStatus] = useState<ActionHookState<VisibleMessage>>({ status: 'idle' });

    function getSuccessMessage(body: UpdateMessageBody): string {
        if (body.deletedDef) return 'Mensaje eliminado para todos.';
        if (body.deleted) return 'Mensaje eliminado.';
        if (body.read) return 'Mensaje marcado como leído.';
        return 'Mensaje actualizado correctamente.';
    }

    async function update(chatId: string, messageId: string, body: UpdateMessageBody) {
        setStatus({ status: 'loading' });

        const result = await updateMessage(session, messageId, body);

        if (result.success) {
            if (!['deleted'].some(key => key in body)) {
                updateStoredMessage(chatId, messageId, result.data);
            }

            setStatus({ status: 'success' as const, data: result.data });
            return;
        }

        setStatus({
            status: 'error' as const,
            message: 'No fue posible actualizar el mensaje.'
        });
    }

    return {
        status,
        update,
        getSuccessMessage
    }
}