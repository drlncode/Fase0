import { useCallback, useRef, useState } from 'react';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { getUsersByUsernameAction } from '@users/lib/usersActions';

import type { PaginationState } from '@shared/types/global.types';
import type { SearchedUserPublicProfile } from '@users/types/user.types';

const INITIAL_PAGINATION: PaginationState = {
    page: 1,
    limit: Number(import.meta.env.VITE_USERS_PER_PAGE) || 10,
    total: null
};

type SearchStatus = 'idle' | 'loading' | 'fetching' | 'success' | 'error';

export function useGetUsersByUsername() {
    const { user: { session } } = useValidAuth();
    const paginationRef = useRef<PaginationState>({ ...INITIAL_PAGINATION });
    const [status, setStatus] = useState<SearchStatus>('idle');
    const [users, setUsers] = useState<SearchedUserPublicProfile[]>([]);
    const [canFetchMore, setCanFetchMore] = useState(false);
    const [total, setTotal] = useState<number>(0);

    const updateCanFetchMore = (pagination: PaginationState) => {
        const canMore = pagination.total !== null
            && pagination.page <= Math.ceil(pagination.total / pagination.limit);
        setCanFetchMore(canMore);
        setTotal(pagination.total ?? 0);
    };

    const loadUsers = useCallback(async (username: string) => {
        if (!username) return;

        const isInitial = paginationRef.current.total === null;
        setStatus(isInitial ? 'loading' : 'fetching');

        const { page, limit } = paginationRef.current;
        const canMore = paginationRef.current.total !== null
            && paginationRef.current.page <= Math.ceil(paginationRef.current.total / paginationRef.current.limit);
        const nextPage = canMore ? paginationRef.current.page : page;

        const result = await getUsersByUsernameAction(username, session, { page: nextPage, limit });

        if (!result.success) {
            setStatus('error');
            return { status: 'error' as const, message: 'Failed at fetching users by username...' };
        }

        const { totalCount, data } = result.data;
        const newPagination = { ...paginationRef.current, total: totalCount, page: nextPage + 1 };
        paginationRef.current = newPagination;
        updateCanFetchMore(newPagination);
        setUsers(prev => isInitial ? data.users : [...prev, ...data.users]);
        setStatus('success');

        return {
            status: 'success' as const,
            data: data.users,
            pagination: {
                page: result.data.page,
                limit: result.data.limit,
                totalCount: result.data.totalCount
            }
        };
    }, [session]);

    const loadMore = useCallback(async (username: string) => {
        if (!username) return;
        if (status === 'loading' || status === 'fetching') return;
        return loadUsers(username);
    }, [loadUsers, status]);

    const reset = useCallback(() => {
        paginationRef.current = { ...INITIAL_PAGINATION };
        setUsers([]);
        setStatus('idle');
        setCanFetchMore(false);
        setTotal(0);
    }, []);

    return {
        loadUsers,
        loadMore,
        reset,
        users,
        status,
        canFetchMore,
        total
    };
}