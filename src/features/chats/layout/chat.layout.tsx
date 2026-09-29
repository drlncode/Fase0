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
                isChatOpen ? 'hidden md:flex md:h-full md:w-auto md:shrink-0' : 'flex h-full w-full md:w-auto md:shrink-0'
            )}>
                <ChatsListContainer />
            </div>
            <div className={cn(
                'min-h-0 min-w-0 select-text',
                isChatOpen ? 'flex h-full w-full md:flex-1' : 'hidden md:flex md:h-full md:min-w-0 md:flex-1'
            )}>
                <Outlet />
            </div>
        </section>
    );
}
