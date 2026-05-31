import type { PaginationState } from '@shared/types/global.types';

interface UsePaginationConfig {
    pagination: PaginationState;
    setPagination: (pagination: Partial<PaginationState>) => void;
}

export function usePagination({ pagination, setPagination }: UsePaginationConfig) {
    const canFetchMore = pagination.total !== null
        && pagination.page <= Math.ceil(pagination.total / pagination.limit);

    const nextPage = canFetchMore ? pagination.page : null;

    const setTotal = (total: number) => setPagination({ total });

    const incrementPage = () => setPagination({ page: pagination.page + 1 });

    const reset = () => setPagination({ page: 1, total: null });

    return {
        page: pagination.page,
        limit: pagination.limit,
        canFetchMore,
        nextPage,
        setTotal,
        incrementPage,
        reset,
    };
}