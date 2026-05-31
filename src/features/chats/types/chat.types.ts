import type { UserPublicProfile } from '@users/types/user.types';
import type { PublicMessage, VisibleMessage } from '@messages/types/message.types';
import type { FetchState } from '@shared/types/global.types';

type ChatsStatus = 
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'fetching' }
    | { status: 'success' }
    | { status: 'error', message: string }

export interface Chat {
    _id: string;
    participant: UserPublicProfile;
    chatInfo: {
        status: 'ACTIVE' | 'SUSPENDED' | 'BLOCKED';
        unreadMessages: number;
        lastMessage: VisibleMessage | null;
        favorite: boolean;
        pinned: boolean;
    },
    lastActivity: number,
    createdAt: number
}

export interface UpdatableChatData {
    chatBlocked?: boolean,
    chatDeleted?: boolean,
    favorite?: boolean,
    pinned?: boolean
}

export type ChatsFilter = 'ALL' | 'UNREAD' | 'FAVORITES';

export interface ChatStore {
    chats: Chat[],
    filteredChats: Chat[],
    activeChat: Chat | null,
    onReplyMessage: { chatId: string, messageId: string } | null;
    onEditMessage: { chatId: string, message: PublicMessage } | null;
    unreadChats: number,
    chatsFetch: FetchState<ChatsStatus>,
    selectedChatsFilter: ChatsFilter;
    searchQuery: string;
    findChat: (chatId: string) => Chat | null;
    setChats: (chats: Chat[]) => void;
    setChatsSuccess: (chats: Chat[]) => void;
    setActiveChat: (chat: Chat) => void;
    setUnreadChats: (chats: Chat[]) => void;
    setChat: (chat: Chat) => void;
    updateChat: (chat: Chat) => void;
    removeChat: (chat: Chat) => void;
    setChatsFetchStatus: (status: ChatsStatus) => void;
    setChatsFetchPagination: (pagination: Partial<FetchState<ChatsStatus>['pagination']>) => void;
    incrementChatsFetchTotal: () => void;
    decrementChatsFetchTotal: () => void;
    setSelectedChatsFilter: (filter: ChatsFilter) => void;
    setSearchQuery: (query: string) => void;
    setOnReplyMessage: (onReplyMessage: { chatId: string, messageId: string } | null) => void;
    setOnEditMessage: (onEditMessage: { chatId: string, message: PublicMessage } | null) => void;
    reset: () => void;
};
