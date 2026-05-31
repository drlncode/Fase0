import { FriendsService } from '@friends/services/friends.service';

import type { ServiceResponse, PaginatedParams } from '@/shared/types/global.types';
import type {
    GetFriendsResponse,
    GetFriendsRequestsResponse,
    GetFriendsSentRequestsResponse,
    SendFriendRequestResponse,
    AcceptFriendRequestResponse,
    CancelFriendRequestResponse,
    RejectFriendRequestResponse,
    DeleteFriendResponse
} from '@friends/services/friends.service';
import { isAxiosError } from 'axios';

export async function getFriends(
        session: string,
        params?: PaginatedParams
): Promise<ServiceResponse<GetFriendsResponse>> {
    try {
        const data = await FriendsService.getFriends({ session, params });

        return {
            success: true,
            data
        }
    } catch (error) {
        if (isAxiosError(error)) return {
            success: false,
            error
        }
    }

    return {
        success: false
    }
}

export async function getFriendsRequests(
    session: string,
    params?: PaginatedParams
): Promise<ServiceResponse<GetFriendsRequestsResponse>> {
    try {
        const data = await FriendsService.getFriendsRequests({ session, params });

        return {
            success: true,
            data
        }
    } catch (error) {
        if (isAxiosError(error)) return {
            success: false,
            error
        }
    }

    return {
        success: false
    }
}

export async function getFriendsSentRequests(
    session: string,
    params?: PaginatedParams
): Promise<ServiceResponse<GetFriendsSentRequestsResponse>> {
    try {
        const data = await FriendsService.getFriendsSentRequests({ session, params });

        return {
            success: true,
            data
        }
    } catch (error) {
        if (isAxiosError(error)) return {
            success: false,
            error
        }
    }

    return {
        success: false
    }
}

export async function sendFriendRequest(
    session: string,
    userId: string
): Promise<ServiceResponse<SendFriendRequestResponse>> {
    try {
        const data = await FriendsService.sendFriendRequest({ session, userId });

        return {
            success: true,
            data
        }
    } catch (error) {
        if (isAxiosError(error)) return {
            success: false,
            error
        }
    }

    return {
        success: false
    }
}

export async function acceptFriendRequest(
    session: string,
    requestId: string
): Promise<ServiceResponse<AcceptFriendRequestResponse>> {
    try {
        const data = await FriendsService.acceptFriendRequest({ session, requestId });

        return {
            success: true,
            data
        }
    } catch (error) {
        if (isAxiosError(error)) return {
            success: false,
            error
        }
    }

    return {
        success: false
    }
}

export async function cancelFriendRequest(
    session: string,
    requestId: string
): Promise<ServiceResponse<CancelFriendRequestResponse>> {
    try {
        const data = await FriendsService.cancelFriendRequest({ session, requestId });
        
        return {
            success: true,
            data
        }
    } catch (error) {
        if (isAxiosError(error)) return {
            success: false,
            error
        }
    }

    return {
        success: false
    }
}

export async function rejectFriendRequest(
    session: string,
    requestId: string
): Promise<ServiceResponse<RejectFriendRequestResponse>> {
    try {
        const data = await FriendsService.rejectFriendRequest({ session, requestId });

        return {
            success: true,
            data
        }
    } catch (error) {
        if (isAxiosError(error)) return {
            success: false,
            error
        }
    }

    return {
        success: false
    }
}

export async function deleteFriend(
    session: string,
    friendshipId: string
): Promise<ServiceResponse<DeleteFriendResponse>> {
    try {
        const data = await FriendsService.deleteFriend({ session, friendshipId });

        return {
            success: true,
            data
        }
    } catch (error) {
        if (isAxiosError(error)) return {
            success: false,
            error
        }
    }

    return {
        success: false
    }
}
