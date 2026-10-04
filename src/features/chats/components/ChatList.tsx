import { useMatch } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Avatar } from '@shared/components/Avatar';
import { useAvatarUrl } from '@shared/hooks/useAvatarUrl';
import { useHorizontalSwipe } from '@shared/hooks/useHorizontalSwipe';
import { useIsCoarsePointer } from '@shared/hooks/useMediaQuery';
import { useModal } from '@shared/hooks/useModal';
import { ChatListDropdown } from '@chats/components/ChatListDropdown';
import { ChatActionsSheetContent } from '@chats/components/ChatActionsSheetContent';
import { ChatTime } from '@chats/components/ChatTime';
import { ChatListLastMessage } from '@chats/components/ChatListLastMessage';

import type { Chat } from '@chats/types/chat.types';
import { NavLink } from 'react-router';
import { cn } from '@/shared/utils/cn';

export function ChatList({ chat }: { chat: Chat }) {
    const { t } = useTranslation('chats');
    const { onError, url } = useAvatarUrl(chat.participant.avatar, chat.participant._id);
    const match = useMatch('/app/chat/:chatId');
    const isActive = match?.params?.chatId === chat._id;
    const hasUnreadMessages = chat.chatInfo.unreadMessages > 0;
    const totalBadges = [chat.chatInfo.pinned, chat.chatInfo.favorite, hasUnreadMessages].filter(Boolean).length as 0 | 1 | 2 | 3;
    const { openBottomSheet } = useModal();
    const isTouch = useIsCoarsePointer();
    const swipe = useHorizontalSwipe({
        allowed: ['left'],
        disabled: !isTouch,
        onSwipe: () => openBottomSheet({ content: <ChatActionsSheetContent chat={chat} /> }),
    });

    return (
        <div
            className={cn(
                'group relative touch-pan-y rounded-lg transition-all duration-150 ease-out hover:bg-subtle active:scale-[0.99]',
                isActive && 'bg-subtle'
            )}
            style={{
                transform: swipe.offsetX ? `translateX(${swipe.offsetX}px)` : undefined,
                transition: swipe.isSwiping ? 'none' : undefined,
            }}
            onTouchStart={swipe.handlers.onTouchStart}
            onTouchMove={swipe.handlers.onTouchMove}
            onTouchEnd={swipe.handlers.onTouchEnd}
            onTouchCancel={swipe.handlers.onTouchCancel}
            onClickCapture={swipe.handlers.onClickCapture}
        >
            <NavLink 
                to={`/app/chat/${chat._id}`} 
                className='flex flex-col p-2.5'
                aria-label={t('list.ariaLabel', { name: chat.participant.name })}
            >
                <div className='flex items-center gap-2'>

                    <div>
                        <Avatar
                            url={url}
                            userUrlStatus={chat.participant.avatar}
                            externalError={onError}
                            alt={t('list.avatarAlt', { name: chat.participant.name.split(' ')[0] })}
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
