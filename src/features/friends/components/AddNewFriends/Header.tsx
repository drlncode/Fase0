import { useTranslation } from 'react-i18next';
import { SearchBar } from '@shared/components/SearchBar';
import { UserSearchIcon } from '@/shared/components/ui/Icons';

interface AddNewFriendsHeaderProps {
    onSearch?: (query: string) => void;
    focus?: boolean;
}

export function AddNewFriendsHeader({ onSearch, focus }: AddNewFriendsHeaderProps) {
    const { t } = useTranslation('friends');
    return (
        <header className='sticky -top-px z-10 bg-surface px-0.5 backdrop-blur-sm'>
            <SearchBar
                icon={<UserSearchIcon size={18} />}
                label={t('addNewFriends.headerLabel')}
                prefix='@'
                onSearch={onSearch}
                focus={focus}
            />
        </header>
    );
}
