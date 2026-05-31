import { ChatHeader } from '@chats/components/ChatHeader';
import { MessagesContainer } from '@messages/components/MessagesContainer';
import { ChatInput } from '@chats/components/ChatInput';

import type { Chat } from '@chats/types/chat.types';

export function Chat({ chat }: { chat: Chat }) {
    return (
        <section className='relative flex min-h-0 w-full flex-1 flex-col'>
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0 opacity-[0.09]"
                style={{
                    backgroundImage: "url('/chat-background.avif')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            />
            <div className='relative z-10 flex min-h-0 w-full flex-1 flex-col'>
                <title>{`${chat.chatInfo.unreadMessages > 0 ? `(${chat.chatInfo.unreadMessages}) ` : ''}Chat de @${chat.participant.username} | Fase0`}</title>
                <ChatHeader participant={chat.participant} />
                <MessagesContainer chatId={chat._id} />
                <ChatInput />
            </div>
        </section>
    );
}
