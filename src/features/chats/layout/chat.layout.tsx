import { Outlet, useParams } from 'react-router';
import { ChatsListContainer } from '@chats/components/ChatsListContainer';
import { cn } from '@/shared/utils/cn';

export default function ChatLayout() {
    const { chatId } = useParams();
    const isChatOpen = Boolean(chatId);

    return (
        <section className='animate-page-enter flex h-full min-h-0 w-full flex-col rounded-none md:flex-row md:rounded-xl'>
            <div className={cn(
                'min-h-0 min-w-0',
                isChatOpen ? 'hidden md:flex md:h-full' : 'flex h-full w-full'
            )}>
                <ChatsListContainer />
            </div>
            <div className={cn(
                'min-h-0 min-w-0 flex-1 select-text',
                isChatOpen ? 'flex h-full w-full' : 'hidden md:flex md:h-full'
            )}>
                <Outlet />
            </div>
        </section>
    );
}
