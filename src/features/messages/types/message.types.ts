import type { PaginationState } from '@shared/types/global.types';

export type MessageStatus = 'SENT' | 'READ' | 'READ_BY_ALL' | 'DELETED_FOR_ALL';
export type LocalMessageStatus = MessageStatus | 'SENDING';

export interface PublicMessage {
    _id: string;
    chatId: string;
    senderId: string;
    content: string;
    replyToMessageId: string | null;
    createdAt: number;
    status: MessageStatus;
    editInfo: {
        isEdited: boolean;
        editableUntil: number;
        editedAt: number | null;
    };
    deletableUntil: number;
}

export interface OptimisticMessage {
    _id: string;
    chatId: string;
    senderId: string;
    content: string;
    replyToMessageId: string | null;
    replyToSenderUsername: string | null;
    replyToContent: string | null;
    status: 'SENDING';
    createdAt: number;
}

export type StoreMessage = VisibleMessage | OptimisticMessage;

export interface DeletedForAllMessage {
    _id: string;
    chatId: string;
    senderId: string;
    replyToMessageId: string | null;
    createdAt: number;
    status: 'DELETED_FOR_ALL';
}

export type VisibleMessage = PublicMessage | DeletedForAllMessage;

export type Message = PublicMessage;
export type DeletedMessage = DeletedForAllMessage;

export interface CreateMessageBody {
    content: string;
    chatId: string;
    replyTo: string | null;
    temp_id?: string;
}

export interface UpdateMessageBody {
    content?: string;
    read?: true;
    deleted?: true;
    deletedDef?: true;
}

export interface MarkBatchAsReadBody {
    messageIds: string[];
}

export type ChatMessageState = {
    state: 'idle' | 'loading' | 'fetching' | 'success' | 'error';
    messages: StoreMessage[];
    error?: string;
    pagination: PaginationState;
};

type MessagesByChat = Map<string, ChatMessageState>;

export interface MessageStore {
    messagesByChat: MessagesByChat;
    getChatState: (chatId: string) => ChatMessageState | undefined;
    registerChat: (chatId: string) => void;
    setMessages: (chatId: string, messages: VisibleMessage[]) => void;
    addMessage: (chatId: string, message: VisibleMessage) => void;
    addOptimisticMessage: (chatId: string, message: OptimisticMessage) => void;
    replaceOptimisticMessage: (chatId: string, tempId: string, realMessage: VisibleMessage) => void;
    updateMessage: (chatId: string, messageId: string, message: VisibleMessage) => void;
    setChatMessagesAsRead: (chatId: string, messageIds: string[]) => void;
    removeMessage: (chatId: string, messageId: string) => void;
    clearChatMessages: (chatId: string) => void;
    setChatFetchState: (chatId: string, state: ChatMessageState['state'], error?: string) => void;
    setChatPagination: (chatId: string, pagination: Partial<PaginationState>) => void;
    reset: () => void;
}
