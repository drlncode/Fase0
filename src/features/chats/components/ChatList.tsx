import { useMatch } from 'react-router';
import { Avatar } from '@shared/components/Avatar';
import { useAvatarUrl } from '@shared/hooks/useAvatarUrl';
import { ChatListDropdown } from '@chats/components/ChatListDropdown';
import { ChatTime } from '@chats/components/ChatTime';
import { ChatListLastMessage } from '@chats/components/ChatListLastMessage';

import type { Chat } from '@chats/types/chat.types';
import { NavLink } from 'react-router';
import { cn } from '@/shared/utils/cn';

export function ChatList({ chat }: { chat: Chat }) {
    const { onError, url } = useAvatarUrl(chat.participant.avatar, chat.participant._id);
    const match = useMatch('/app/chat/:chatId');
    const isActive = match?.params?.chatId === chat._id;
    const hasUnreadMessages = chat.chatInfo.unreadMessages > 0;
    const totalBadges = [chat.chatInfo.pinned, chat.chatInfo.favorite, hasUnreadMessages].filter(Boolean).length as 0 | 1 | 2 | 3;

    return (
        <div className={cn(
            'group relative rounded-lg transition-all duration-150 ease-out hover:bg-subtle active:scale-[0.99]',
            isActive && 'bg-subtle'
        )}>
            <NavLink 
                to={`/app/chat/${chat._id}`} 
                className='flex flex-col p-2.5'
                aria-label={`Chat con ${chat.participant.name}`}
            >
                <div className='flex items-center gap-2'>

                    <div>
                        <Avatar
                            url={url}
                            userUrlStatus={chat.participant.avatar}
                            externalError={onError}
                            alt={`${chat.participant.name.split(' ')[0]}'s avatar`}
                            name={chat.participant.name}
                        />
                    </div>

                    <div className='flex min-w-0 flex-1 flex-col'>

                        <div className='flex items-center gap-2.5'>
                            <div className='group/name_username h-5 min-w-0 flex-1 overflow-hidden'>
                                <div className='flex flex-col text-primary/75 transition-transform duration-150 ease-in-out group-hover/name_username:-translate-y-1/2'>
                                    <span className='flex h-5 items-center font-medium opacity-100 transition-opacity duration-250 ease-in-out group-hover/name_username:opacity-0'>
                                        <span className='truncate'>{chat.participant.name}</span>
                                    </span>

                                    <span className='flex h-5 items-center text-xs opacity-0 transition-opacity duration-250 ease-in-out group-hover/name_username:opacity-100'>
                                        <span className='truncate'>@{chat.participant.username}</span>
                                    </span>
                                </div>
                            </div>
                            <span className={cn(
                                'ml-1 shrink-0 text-xs whitespace-nowrap',
                                hasUnreadMessages && 'text-primary'
                            )}>
                                <ChatTime 
                                    timestamp={chat.lastActivity}
                                    className={hasUnreadMessages ? 'text-primary' : undefined}
                                />
                            </span>
                        </div>

                        <div className='flex min-h-6 items-center'>
                            <ChatListLastMessage
                                message={chat.chatInfo.lastMessage}
                                totalBadges={totalBadges}
                            />
                        </div>

                    </div>
                </div>
            </NavLink>
            <ChatListDropdown chat={chat} />
        </div>
    );
}
