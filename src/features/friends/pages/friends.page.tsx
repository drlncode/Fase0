import { useSearchParams } from 'react-router';
import { AddNewFriendsSection } from '@friends/components/AddNewFriends/Section';
import { PendingRequestsSection } from '@friends/components/PendingRequests/Section';
import { PendingSentRequestsSection } from '@/features/friends/components/PendingSentRequests/Section';
import { FriendsListSection } from '@friends/components/FriendsList/Section';

export default function FriendsPage() {
    const [ searchParams ] = useSearchParams();
    const section = searchParams.get('section');

    return (
        <section className='animate-page-enter flex h-full w-full overflow-hidden p-2.5 pt-3 select-text'>
            <title>Amigos | Fase0</title>
            <AddNewFriendsSection highlight={section === 'add-friend'} />
            <div className='flex h-full flex-1 flex-col overflow-hidden'>
                <FriendsListSection highlight={section === 'active-friends'} />
                <PendingRequestsSection highlight={section === 'pending-requests'} />
                <PendingSentRequestsSection highlight={section === 'sent-requests'} />
            </div>
        </section>
    );
}
