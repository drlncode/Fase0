import { useRef, useState, useCallback } from 'react';
import debounce from 'just-debounce-it';
import { AddNewFriendsHeader } from '@friends/components/AddNewFriends/Header';
import { UsersFoundContainer } from '@friends/components/AddNewFriends/UsersFoundContainer';
import { useGetUsersByUsername } from '@users/hooks/useGetUsersByUsername';
import { useRefetchOnFriendsChange } from '@friends/hooks/useRefetchOnFriendsChange';

export function AddNewFriendsSection({ highlight = false }) {
    const [ username, setUsername ] = useState<string | undefined>();
    const { loadUsers, loadMore, reset, users, status, canFetchMore, total } = useGetUsersByUsername();

    const performSearch = useCallback(async (searchUsername: string | undefined) => {
        if (!searchUsername) {
            reset();
            return;
        }

        await loadUsers(searchUsername);
    }, [loadUsers, reset]);

    const refetch = useCallback(() => {
        if (username) {
            performSearch(username);
        }
    }, [username, performSearch]);

    useRefetchOnFriendsChange(refetch, !!username && username.length >= 3);

    const debouncedSetUsername = useRef(
        debounce((str?: string) => {
            setUsername(str);
            performSearch(str);
        }, 500)
    ).current;

    const handleSearch = (query: string) => {
        if (!query) {
            debouncedSetUsername.cancel();
            setUsername(undefined);
            reset();
            return;
        }

        if (query.length < 3) return;

        debouncedSetUsername(query);
    };

    const handleLoadMore = () => {
        if (username) {
            loadMore(username);
        }
    };

    return (
        <div className='-m-0.5 mr-1 flex h-full max-w-89 flex-1 flex-col overflow-auto p-0.5 pr-1'>
            <AddNewFriendsHeader onSearch={handleSearch} focus={highlight} />
            <UsersFoundContainer
                users={users}
                status={status}
                username={username}
                canFetchMore={canFetchMore}
                total={total ?? 0}
                onLoadMore={handleLoadMore}
            />
        </div>
    );
}