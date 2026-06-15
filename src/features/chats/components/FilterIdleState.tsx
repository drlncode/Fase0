import { useTranslation } from 'react-i18next';
import { MessageIcon, MessageSearchIcon, StarIcon, MessageOffIcon } from '@/shared/components/ui/Icons';

interface FilterIdleStateProps {
    filter: 'ALL' | 'UNREAD' | 'FAVORITES' | 'SEARCH';
    searchQuery?: string;
}

export function FilterIdleState({ filter, searchQuery }: FilterIdleStateProps) {
    const { t } = useTranslation('chats');

    const IDLE_CONFIG: Record<string, { icon: React.ReactNode; title: string; subtitle: string }> = {
        ALL: {
            icon: <MessageIcon size={28} />,
            title: t('idle.noChats'),
            subtitle: t('idle.noChatsSubtitle')
        },
        UNREAD: {
            icon: <MessageOffIcon size={28} />,
            title: t('idle.noUnread'),
            subtitle: t('idle.noUnreadSubtitle')
        },
        FAVORITES: {
            icon: <StarIcon size={28} />,
            title: t('idle.noFavorites'),
            subtitle: t('idle.noFavoritesSubtitle')
        },
        SEARCH: {
            icon: <MessageSearchIcon size={28} />,
            title: t('idle.noResults'),
            subtitle: ''
        }
    };

    const config = IDLE_CONFIG[filter];

    const subtitle = filter === 'SEARCH' && searchQuery
        ? t('idle.noResultsSubtitle', { query: searchQuery })
        : config.subtitle;

    return (
        <div className='flex w-full flex-col items-center gap-4 px-2 py-10 text-center'>
            <div className='flex h-14 w-14 items-center justify-center rounded-full bg-subtle'>
                {config.icon}
            </div>
            <div className='flex flex-col items-center gap-1'>
                <p className='text-sm font-medium text-primary'>{config.title}</p>
                <p className='max-w-[82%] text-xs text-secondary'>{subtitle}</p>
            </div>
        </div>
    );
}
