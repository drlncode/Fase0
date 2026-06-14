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
        params?: PaginatedParams
): Promise<ServiceResponse<GetFriendsResponse>> {
    try {
        const data = await FriendsService.getFriends({ params });

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
    params?: PaginatedParams
): Promise<ServiceResponse<GetFriendsRequestsResponse>> {
    try {
        const data = await FriendsService.getFriendsRequests({ params });

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
    params?: PaginatedParams
): Promise<ServiceResponse<GetFriendsSentRequestsResponse>> {
    try {
        const data = await FriendsService.getFriendsSentRequests({ params });

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
    userId: string
): Promise<ServiceResponse<SendFriendRequestResponse>> {
    try {
        const data = await FriendsService.sendFriendRequest({ userId });

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
    requestId: string
): Promise<ServiceResponse<AcceptFriendRequestResponse>> {
    try {
        const data = await FriendsService.acceptFriendRequest({ requestId });

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
    requestId: string
): Promise<ServiceResponse<CancelFriendRequestResponse>> {
    try {
        const data = await FriendsService.cancelFriendRequest({ requestId });
        
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
    requestId: string
): Promise<ServiceResponse<RejectFriendRequestResponse>> {
    try {
        const data = await FriendsService.rejectFriendRequest({ requestId });

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
    friendshipId: string
): Promise<ServiceResponse<DeleteFriendResponse>> {
    try {
        const data = await FriendsService.deleteFriend({ friendshipId });

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
