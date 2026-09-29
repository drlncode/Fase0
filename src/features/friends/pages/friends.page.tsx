import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { AddNewFriendsSection } from '@friends/components/AddNewFriends/Section';
import { PendingRequestsSection } from '@friends/components/PendingRequests/Section';
import { PendingSentRequestsSection } from '@/features/friends/components/PendingSentRequests/Section';
import { FriendsListSection } from '@friends/components/FriendsList/Section';
import { FriendsMobileTabs, type FriendsMobileTab } from '@friends/components/FriendsMobileTabs';

const VALID_TABS: FriendsMobileTab[] = ['active-friends', 'pending-requests', 'sent-requests', 'add-friend'];

export default function FriendsPage() {
    const { t } = useTranslation('friends');
    const [ searchParams, setSearchParams ] = useSearchParams();
    const sectionParam = searchParams.get('section');
    const activeTab: FriendsMobileTab = VALID_TABS.includes(sectionParam as FriendsMobileTab)
        ? (sectionParam as FriendsMobileTab)
        : 'active-friends';

    const handleTabChange = (tab: FriendsMobileTab) => {
        setSearchParams({ section: tab }, { replace: true });
    };

    return (
        <section className='animate-page-enter flex h-full w-full flex-col overflow-hidden select-text lg:p-2.5 lg:pt-3'>
            <title>{t('page.title')}</title>
            <FriendsMobileTabs active={activeTab} onChange={handleTabChange} />

            {/* Vista móvil: una sola sección por tab */}
            <div className='flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden p-2 lg:hidden'>
                {activeTab === 'add-friend' && <AddNewFriendsSection highlight />}
                {activeTab === 'active-friends' && (
                    <div className='flex h-full min-h-0 flex-1 flex-col overflow-hidden'>
                        <FriendsListSection highlight defaultOpen />
                    </div>
                )}
                {activeTab === 'pending-requests' && (
                    <div className='flex h-full min-h-0 flex-1 flex-col overflow-hidden'>
                        <PendingRequestsSection highlight defaultOpen />
                    </div>
                )}
                {activeTab === 'sent-requests' && (
                    <div className='flex h-full min-h-0 flex-1 flex-col overflow-hidden'>
                        <PendingSentRequestsSection highlight defaultOpen />
                    </div>
                )}
            </div>

            {/* Vista desktop: dos columnas */}
            <div className='hidden h-full w-full flex-1 overflow-hidden lg:flex'>
                <AddNewFriendsSection highlight={activeTab === 'add-friend'} />
                <div className='flex h-full flex-1 flex-col overflow-hidden'>
                    <FriendsListSection highlight={activeTab === 'active-friends'} defaultOpen={activeTab === 'active-friends'} />
                    <PendingRequestsSection highlight={activeTab === 'pending-requests'} defaultOpen={activeTab === 'pending-requests'} />
                    <PendingSentRequestsSection highlight={activeTab === 'sent-requests'} defaultOpen={activeTab === 'sent-requests'} />
                </div>
            </div>
        </section>
    );
}
