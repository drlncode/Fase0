import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import type { MessageStore, ChatMessageState, VisibleMessage, StoreMessage } from '@messages/types/message.types';

const MESSAGES_PER_PAGE = Number(import.meta.env.VITE_MESSAGES_PER_PAGE) || 30;

const DEFAULT_CHAT_STATE: ChatMessageState = {
    state: 'idle',
    messages: [],
    pagination: { page: 1, limit: MESSAGES_PER_PAGE, total: null }
};

function createDefaultChatState(): ChatMessageState {
    return {
        ...DEFAULT_CHAT_STATE,
        pagination: { ...DEFAULT_CHAT_STATE.pagination }
    };
}

function mergeMessages(existing: StoreMessage[], incoming: VisibleMessage[]): StoreMessage[] {
    const map = new Map(existing.map(m => [m._id, m]));
    incoming.forEach(m => map.set(m._id, m));
    return Array.from(map.values());
}

function updateMap<K, V>(map: Map<K, V>, key: K, value: V): Map<K, V> {
    const next = new Map(map);
    next.set(key, value);
    return next;
}

function deleteFromMap<K, V>(map: Map<K, V>, key: K): Map<K, V> {
    const next = new Map(map);
    next.delete(key);
    return next;
}

export const useMessageStore = create(
    subscribeWithSelector<MessageStore>((set, get) => ({
        messagesByChat: new Map(),

        getChatState: (chatId) => {
            return get().messagesByChat.get(chatId);
        },

        registerChat: (chatId) => set((state) => {
            if (state.messagesByChat.has(chatId)) return state;
            return {
                messagesByChat: updateMap(state.messagesByChat, chatId, {
                    ...createDefaultChatState(),
                    state: 'loading'
                })
            };
        }),

        setMessages: (chatId, messages) => set((state) => {
            const existing = state.messagesByChat.get(chatId);
            const merged = existing ? mergeMessages(existing.messages, messages) : messages;
            return {
                messagesByChat: updateMap(state.messagesByChat, chatId, {
                    ...(existing ?? createDefaultChatState()),
                    state: 'success',
                    messages: merged,
                    error: undefined
                })
            };
        }),

        addMessage: (chatId, message) => set((state) => {
            const existing = state.messagesByChat.get(chatId);
            if (!existing) return state;
            if (existing.messages.some(m => m._id === message._id)) return state;
            return {
                messagesByChat: updateMap(state.messagesByChat, chatId, {
                    ...existing,
                    messages: [message, ...existing.messages]
                })
            };
        }),

        addOptimisticMessage: (chatId, message) => set((state) => {
            const existing = state.messagesByChat.get(chatId);
            return {
                messagesByChat: updateMap(state.messagesByChat, chatId, {
                    ...(existing ?? createDefaultChatState()),
                    messages: [message, ...(existing?.messages ?? [])]
                })
            };
        }),

        replaceOptimisticMessage: (chatId, tempId, realMessage) => set((state) => {
            const existing = state.messagesByChat.get(chatId);
            if (!existing) return state;

            const tempIdx = existing.messages.findIndex(m => m._id === tempId);

            if (tempIdx !== -1) {
                const messages = [...existing.messages];
                messages[tempIdx] = realMessage;
                return {
                    messagesByChat: updateMap(state.messagesByChat, chatId, {
                        ...existing,
                        messages
                    })
                };
            }

            if (existing.messages.some(m => m._id === realMessage._id)) return state;

            return {
                messagesByChat: updateMap(state.messagesByChat, chatId, {
                    ...existing,
                    messages: [realMessage, ...existing.messages]
                })
            };
        }),

        updateMessage: (chatId, messageId, message) => set((state) => {
            const existing = state.messagesByChat.get(chatId);
            if (!existing) return state;
            return {
                messagesByChat: updateMap(state.messagesByChat, chatId, {
                    ...existing,
                    messages: existing.messages.map(m => m._id === messageId ? message : m)
                })
            };
        }),

        setChatMessagesAsRead: (chatId, messageIds) => set((state) => {
            const existing = state.messagesByChat.get(chatId);
            if (!existing) return state;
            const messageIdSet = new Set(messageIds);
            return {
                messagesByChat: updateMap(state.messagesByChat, chatId, {
                    ...existing,
                    messages: existing.messages.map(m => {
                            if (m.status === 'SENDING' || m.status === 'DELETED_FOR_ALL' || !messageIdSet.has(m._id)) return m;
                            return { ...m, status: 'READ_BY_ALL' as const };
                        })
                })
            };
        }),

        removeMessage: (chatId, messageId) => set((state) => {
            const existing = state.messagesByChat.get(chatId);
            if (!existing) return state;
            return {
                messagesByChat: updateMap(state.messagesByChat, chatId, {
                    ...existing,
                    messages: existing.messages.filter(m => m._id !== messageId)
                })
            };
        }),

        clearChatMessages: (chatId) => set((state) => {
            if (!state.messagesByChat.has(chatId)) return state;
            return { messagesByChat: deleteFromMap(state.messagesByChat, chatId) };
        }),

        setChatFetchState: (chatId, fetchState, error) => set((state) => {
            const existing = state.messagesByChat.get(chatId);
            if (!existing) return state;
            return {
                messagesByChat: updateMap(state.messagesByChat, chatId, {
                    ...existing,
                    state: fetchState,
                    error: fetchState === 'error' ? error : undefined
                })
            };
        }),

        setChatPagination: (chatId, pagination) => set((state) => {
            const existing = state.messagesByChat.get(chatId);
            if (!existing) return state;
            return {
                messagesByChat: updateMap(state.messagesByChat, chatId, {
                    ...existing,
                    pagination: { ...existing.pagination, ...pagination }
                })
            };
        }),

        reset: () => set({ messagesByChat: new Map() })
    }))
);
