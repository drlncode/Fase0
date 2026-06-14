import api from '@/lib/axios';

import type { PaginatedParams, PaginatedResponse } from '@shared/types/global.types';
import type { Friendship, FriendshipRequest, FriendshipRequestSent } from '@friends/types/friends.types';
import type { Chat } from '@chats/types/chat.types';

//* getFriends types:
export type GetFriendsParams = { params?: PaginatedParams };
type GetFriendsData = PaginatedResponse<{ friends: Friendship[] }>;

//* getFriendsRequests types:
export type GetFriendsRequestsParams = { params?: PaginatedParams };
type GetFriendsRequestsData = PaginatedResponse<{ friendsRequests: FriendshipRequest[] }>;

//* getFriendsSentRequests types:
export type GetFriendsSentRequestsParams = { params?: PaginatedParams };
type GetFriendsSentRequestsData = PaginatedResponse<{ friendsRequests: FriendshipRequestSent[] }>;

//* sendFriendRequest types:
export type SendFriendRequestParams = { userId: string };
type SendFriendRequestData = { data: { friendRequest: FriendshipRequestSent } };

//* acceptFriendRequest types:
export type AcceptFriendRequestParams = { requestId: string };
type AcceptFriendRequestData = {
    data: {
        friend: Friendship;
        chatToUpdate: Chat | null;
    }
};

//* cancelFriendRequest types:
export type CancelFriendRequestParams = { requestId: string };
type CancelFriendRequestData = null;

//* rejectFriendRequest types:
export type RejectFriendRequestParams = { requestId: string };
type RejectFriendRequestData = null;

//* deleteFriend types:
export type DeleteFriendParams = { friendshipId: string };
type DeleteFriendData = {
    data: {
        chatToUpdate: Chat | null;
    }
};

export class FriendsService {
    static async getFriends({ params }: GetFriendsParams): Promise<GetFriendsData> {
        const { data } = await api.get<GetFriendsData>('/friends', { params });

        return data;
    }

    static async getFriendsRequests({ params }: GetFriendsRequestsParams): Promise<
        GetFriendsRequestsData
    > {
        const { data } = await api.get<GetFriendsRequestsData>('/friends/requests', { params });

        return data;
    }

    static async getFriendsSentRequests({ params }: GetFriendsSentRequestsParams): Promise<
        GetFriendsSentRequestsData
    > {
        const { data } = await api.get<GetFriendsSentRequestsData>('/friends/requests/sent', { params });

        return data;
    }

    static async sendFriendRequest({ userId }: SendFriendRequestParams): Promise<FriendshipRequestSent> {
        const { data } = await api.post<SendFriendRequestData>(`/friends/requests/${userId}`);

        return data.data.friendRequest;
    }

    static async acceptFriendRequest({ requestId }: AcceptFriendRequestParams): Promise<AcceptFriendRequestData> {
        const { data } = await api.post<AcceptFriendRequestData>(`/friends/requests/accept/${requestId}`);

        return data;
    }

    static async cancelFriendRequest({ requestId }: CancelFriendRequestParams): Promise<CancelFriendRequestData> {
        const { data } = await api.delete<CancelFriendRequestData>(`/friends/requests/sent/${requestId}`);

        return data;
    }

    static async rejectFriendRequest({ requestId }: RejectFriendRequestParams): Promise<RejectFriendRequestData> {
        const { data } = await api.delete<RejectFriendRequestData>(`/friends/requests/${requestId}`);

        return data;
    }

    static async deleteFriend({ friendshipId }: DeleteFriendParams): Promise<DeleteFriendData['data']> {
        const { data } = await api.delete<DeleteFriendData>(`/friends/${friendshipId}`);

        return data.data;
    }
}

export type GetFriendsResponse = Awaited<ReturnType<typeof FriendsService.getFriends>>;
export type GetFriendsRequestsResponse = Awaited<ReturnType<typeof FriendsService.getFriendsRequests>>;
export type GetFriendsSentRequestsResponse = Awaited<ReturnType<typeof FriendsService.getFriendsSentRequests>>;
export type SendFriendRequestResponse = Awaited<ReturnType<typeof FriendsService.sendFriendRequest>>;
export type AcceptFriendRequestResponse = Awaited<ReturnType<typeof FriendsService.acceptFriendRequest>>;
export type CancelFriendRequestResponse = Awaited<ReturnType<typeof FriendsService.cancelFriendRequest>>;
export type RejectFriendRequestResponse = Awaited<ReturnType<typeof FriendsService.rejectFriendRequest>>;
export type DeleteFriendResponse = Awaited<ReturnType<typeof FriendsService.deleteFriend>>;
