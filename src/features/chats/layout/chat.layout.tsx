import { Outlet } from 'react-router';
import { ChatsListContainer } from '@chats/components/ChatsListContainer';

export default function ChatLayout() {
    return (
        <section className='animate-page-enter flex h-full min-h-0 w-full rounded-xl'>
            <ChatsListContainer />
            <div className='min-h-0 min-w-0 flex-1 select-text'>
                <Outlet />
            </div>
        </section>
    );
}
