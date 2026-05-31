import { UserFoundItem } from '@friends/components/AddNewFriends/UserFoundItem';
import { SearchedUsersListSkeleton } from '@friends/components/AddNewFriends/SearchedUserItemSkeleton';
import { InfiniteLoader } from '@shared/components/InfiniteLoader';
import { UserSearchIcon } from '@/shared/components/ui/Icons';

import type { SearchedUserPublicProfile } from '@users/types/user.types';

interface UsersFoundContainerProps {
    users: SearchedUserPublicProfile[];
    status: 'idle' | 'loading' | 'fetching' | 'success' | 'error';
    username?: string;
    canFetchMore: boolean;
    total: number;
    onLoadMore: () => void;
}

export function UsersFoundContainer({ users, status, username, canFetchMore, total, onLoadMore }: UsersFoundContainerProps) {
    const isLoading = status === 'loading';
    const isFetching = status === 'fetching';

    return (
        <section className='flex h-full w-full flex-1 flex-col gap-1.5 py-3'>
            { isLoading && <SearchedUsersListSkeleton /> }
            {status === 'idle' && (
                <div className='flex w-full flex-col items-center gap-3 px-2 py-10 text-center'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-full bg-subtle'>
                        <UserSearchIcon size={24} />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <p className='text-sm font-medium text-primary'>Buscar usuarios</p>
                        <p className='text-xs text-secondary'>Escribe un nombre de usuario para buscar</p>
                    </div>
                </div>
            )}
            {(status === 'success' && !users.length && username) && (
                <div className='flex w-full flex-col items-center gap-3 px-2 py-10 text-center'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-full bg-subtle'>
                        <UserSearchIcon size={24} />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <p className='text-sm font-medium text-primary'>Sin resultados</p>
                        <p className='text-xs text-secondary'>No se encontraron usuarios con ese nombre</p>
                    </div>
                </div>
            )}
            {users.map((user) => (
                <UserFoundItem key={user._id} user={user} externalLoading={isFetching} />
            ))}
            {(status === 'success' || isFetching) && canFetchMore && (
                <InfiniteLoader
                    isFetching={isFetching}
                    canFetchMore={canFetchMore}
                    onLoadMore={onLoadMore}
                >
                    <>{users.length} de {total} usuarios</>
                </InfiniteLoader>
            )}
        </section>
    );
}
