import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import type { Chat, ChatStore } from '@chats/types/chat.types';

const CHATS_FETCH_INITIAL: ChatStore['chatsFetch'] = {
    status: { status: 'idle' },
    pagination: { page: 1, limit: Number(import.meta.env.VITE_CHATS_PER_PAGE) || 20, total: null }
};

function mergeChats(existing: Chat[], incoming: Chat[]): Chat[] {
    const map = new Map(existing.map(c => [c._id, c]));
    incoming.forEach(c => map.set(c._id, c));
    return Array.from(map.values());
}

function upsertChat(chats: Chat[], chat: Chat): Chat[] {
    const index = chats.findIndex(c => c._id === chat._id);
    if (index !== -1) {
        const updated = [...chats];
        updated[index] = chat;
        return updated;
    }
    return [chat, ...chats];
}

function sortChats(chats: Chat[]): Chat[] {
    const pinned = chats.filter(c => c.chatInfo.pinned).sort((a, b) => b.lastActivity - a.lastActivity);
    const unpinned = chats.filter(c => !c.chatInfo.pinned).sort((a, b) => b.lastActivity - a.lastActivity);
    return [...pinned, ...unpinned];
}

function filterChats(chats: Chat[], filter: ChatStore['selectedChatsFilter']): Chat[] {
    if (filter === 'UNREAD') return chats.filter(c => c.chatInfo.unreadMessages > 0);
    if (filter === 'FAVORITES') return chats.filter(c => c.chatInfo.favorite);
    return chats;
}

function searchChats(chats: Chat[], query: string): Chat[] {
    if (!query.trim()) return chats;
    const lowerQuery = query.toLowerCase();
    return chats.filter(c => 
        c.participant.username.toLowerCase().includes(lowerQuery) ||
        c.participant.name.toLowerCase().includes(lowerQuery)
    );
}

export const useChatStore = create(
    subscribeWithSelector<ChatStore>((set, get) => ({
        chats: [],
        filteredChats: [],
        activeChat: null,
        onReplyMessage: null,
        onEditMessage: null,
        unreadChats: 0,
        chatsFetch: { ...CHATS_FETCH_INITIAL },
        selectedChatsFilter: 'ALL',
        searchQuery: '',

        findChat: (chatId) => {
            return get().chats.find(c => c._id === chatId) ?? null;
        },

        setChats: (newChats) => set((prev) => ({
            chats: mergeChats(prev.chats, newChats)
        })),

        setChatsSuccess: (newChats) => set((state) => ({
            chats: mergeChats(state.chats, newChats),
            chatsFetch: { ...state.chatsFetch, status: { status: 'success' } }
        })),

        setChat: (chat) => set((state) => ({
            chats: upsertChat(state.chats, chat)
        })),

        setActiveChat: (activeChat) => set({ activeChat }),

        setUnreadChats: (chats) => set({
            unreadChats: chats.filter(chat => chat.chatInfo.unreadMessages).length
        }),

        updateChat: (updatedChat) => set((state) => {
            const merged = mergeChats(state.chats, [updatedChat]);
            return {
                chats: merged,
                activeChat: state.activeChat?._id === updatedChat._id ? updatedChat : state.activeChat
            };
        }),

        removeChat: (removedChat) => set((state) => ({
            chats: state.chats.filter(c => c._id !== removedChat._id),
            activeChat: state.activeChat?._id === removedChat._id ? null : state.activeChat
        })),

        setChatsFetchStatus: (chatsFetchStatus) => set((state) => ({
            chatsFetch: { ...state.chatsFetch, status: chatsFetchStatus }
        })),

        setChatsFetchPagination: (pagination) => set((state) => ({
            chatsFetch: { ...state.chatsFetch, pagination: { ...state.chatsFetch.pagination, ...pagination } }
        })),

        incrementChatsFetchTotal: () => set((state) => ({
            chatsFetch: {
                ...state.chatsFetch,
                pagination: { ...state.chatsFetch.pagination, total: (state.chatsFetch.pagination.total ?? 0) + 1 }
            }
        })),

        decrementChatsFetchTotal: () => set((state) => ({
            chatsFetch: {
                ...state.chatsFetch,
                pagination: { ...state.chatsFetch.pagination, total: Math.max(0, (state.chatsFetch.pagination.total ?? 1) - 1) }
            }
        })),

        setSelectedChatsFilter: (selectedChatsFilter) => set({ selectedChatsFilter }),

        setSearchQuery: (searchQuery) => set({ searchQuery }),

        setOnReplyMessage: (onReplyMessage) => set({ onReplyMessage, onEditMessage: null }),

        setOnEditMessage: (onEditMessage) => set({ onEditMessage, onReplyMessage: null }),

        reset: () => set({
            chats: [],
            filteredChats: [],
            activeChat: null,
            onReplyMessage: null,
            onEditMessage: null,
            unreadChats: 0,
            chatsFetch: { ...CHATS_FETCH_INITIAL },
            selectedChatsFilter: 'ALL',
            searchQuery: ''
        })
    }))
);

let isProcessing = false;
useChatStore.subscribe(
    ({ chats, selectedChatsFilter, searchQuery }) => ({ chats, selectedChatsFilter, searchQuery }),
    ({ chats, selectedChatsFilter, searchQuery }) => {
        if (isProcessing) return;
        isProcessing = true;

        const filtered = filterChats(chats, selectedChatsFilter);
        const searched = searchChats(filtered, searchQuery);
        const sorted = sortChats(searched);

        useChatStore.setState({ filteredChats: sorted });
        isProcessing = false;
    }
);

useChatStore.subscribe(
    ({ chats }) => chats,
    (chats) => {
        const unreadCount = chats.filter(chat => chat.chatInfo.unreadMessages).length;
        if (unreadCount !== useChatStore.getState().unreadChats) {
            useChatStore.setState({ unreadChats: unreadCount });
        }
    }
);