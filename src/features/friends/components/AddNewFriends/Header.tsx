import { SearchBar } from '@shared/components/SearchBar';
import { UserSearchIcon } from '@/shared/components/ui/Icons';

interface AddNewFriendsHeaderProps {
    onSearch?: (query: string) => void;
    focus?: boolean;
}

export function AddNewFriendsHeader({ onSearch, focus }: AddNewFriendsHeaderProps) {
    return (
        <header className='sticky -top-px z-10 bg-surface px-0.5 backdrop-blur-sm'>
            <SearchBar
                icon={<UserSearchIcon size={18} />}
                label='Buscar por nombre de usuario'
                prefix='@'
                onSearch={onSearch}
                focus={focus}
            />
        </header>
    );
}
