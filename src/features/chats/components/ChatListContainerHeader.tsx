import { useChatStore } from '@chats/store/useChatStore';
import { SearchBar } from '@shared/components/SearchBar';
import { ChatBadge } from '@chats/components/ChatBadge';
import { MessageSearchIcon } from '@/shared/components/ui/Icons';

import type { ChatsFilter } from '@chats/types/chat.types';

export function ChatListContainerHeader() {
    const unreadChats = useChatStore(state => state.unreadChats);
    const selectedChatsFilter = useChatStore(state => state.selectedChatsFilter);
    const setSelectedChatsFilter = useChatStore(state => state.setSelectedChatsFilter);
    const setSearchQuery = useChatStore(state => state.setSearchQuery);

    const handleFilterClick = (filter: ChatsFilter) => {
        setSelectedChatsFilter(filter);
    }

    return (
        <header className='sticky top-0 z-10 -mx-2.5 mb-2 flex justify-center rounded-tl-xl bg-surface px-2.5 pt-3 backdrop-blur-sm'>
            <div className='w-full border-b border-b-default pb-1'>
                <SearchBar
                    label='Buscar chats'
                    icon={<MessageSearchIcon size={18} />}
                    onSearch={setSearchQuery}
                />
                <div className='flex gap-1.5 py-2'>
                    <ChatBadge
                        label='Todos'
                        isActive={selectedChatsFilter === 'ALL'}
                        onClick={() => handleFilterClick('ALL')}
                    />
                    <ChatBadge
                        label='No leídos'
                        isActive={selectedChatsFilter === 'UNREAD'}
                        info={unreadChats}
                        onClick={() => handleFilterClick('UNREAD')}
                    />
                    <ChatBadge
                        label='Favoritos'
                        isActive={selectedChatsFilter === 'FAVORITES'}
                        onClick={() => handleFilterClick('FAVORITES')}
                    />
                </div>
            </div>
        </header>
    );
}
