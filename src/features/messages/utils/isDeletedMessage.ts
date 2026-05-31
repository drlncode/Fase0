import type { StoreMessage, DeletedForAllMessage } from '@messages/types/message.types';

export function isDeletedMessage(message: StoreMessage): message is DeletedForAllMessage {
    return message.status === 'DELETED_FOR_ALL';
}
