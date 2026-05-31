import api from '@/lib/axios';

import type { PaginatedParams, PaginatedResponse } from '@shared/types/global.types';
import type { Friendship, FriendshipRequest, FriendshipRequestSent } from '@friends/types/friends.types';
import type { Chat } from '@chats/types/chat.types';

//* getFriends types:
export type GetFriendsParams = { session: string, params?: PaginatedParams };
type GetFriendsData = PaginatedResponse<{ friends: Friendship[] }>;

//* getFriendsRequests types:
export type GetFriendsRequestsParams = { session: string, params?: PaginatedParams };
type GetFriendsRequestsData = PaginatedResponse<{ friendsRequests: FriendshipRequest[] }>;

//* getFriendsSentRequests types:
export type GetFriendsSentRequestsParams = { session: string, params?: PaginatedParams };
type GetFriendsSentRequestsData = PaginatedResponse<{ friendsRequests: FriendshipRequestSent[] }>;

//* sendFriendRequest types:
export type SendFriendRequestParams = { session: string, userId: string };
type SendFriendRequestData = { data: { friendRequest: FriendshipRequestSent } };

//* acceptFriendRequest types:
export type AcceptFriendRequestParams = { session: string, requestId: string };
type AcceptFriendRequestData = {
    data: {
        friend: Friendship;
        chatToUpdate: Chat | null;
    }
};

//* cancelFriendRequest types:
export type CancelFriendRequestParams = { session: string, requestId: string };
type CancelFriendRequestData = null;

//* rejectFriendRequest types:
export type RejectFriendRequestParams = { session: string, requestId: string };
type RejectFriendRequestData = null;

//* deleteFriend types:
export type DeleteFriendParams = { session: string, friendshipId: string };
type DeleteFriendData = {
    data: {
        chatToUpdate: Chat | null;
    }
};

export class FriendsService {
    static async getFriends({ session, params }: GetFriendsParams): Promise<GetFriendsData> {
        const { data } = await api.get<GetFriendsData>('/friends', {
            headers: {
                Authorization: `Bearer ${session}`
            },
            params
        });

        return data;
    }

    static async getFriendsRequests({ session, params }: GetFriendsRequestsParams): Promise<
        GetFriendsRequestsData
    > {
        const { data } = await api.get<GetFriendsRequestsData>('/friends/requests', {
            headers: {
                Authorization: `Bearer ${session}`
            },
            params
        });

        return data;
    }

    static async getFriendsSentRequests({ session, params }: GetFriendsSentRequestsParams): Promise<
        GetFriendsSentRequestsData
    > {
        const { data } = await api.get<GetFriendsSentRequestsData>('/friends/requests/sent', {
            headers: {
                Authorization: `Bearer ${session}`
            },
            params
        });

        return data;
    }

    static async sendFriendRequest({ session, userId }: SendFriendRequestParams): Promise<FriendshipRequestSent> {
        const { data } = await api.post<SendFriendRequestData>(`/friends/requests/${userId}`, null, {
            headers: {
                Authorization: `Bearer ${session}`
            }
        });

        return data.data.friendRequest;
    }

    static async acceptFriendRequest({ session, requestId }: AcceptFriendRequestParams): Promise<AcceptFriendRequestData> {
        const { data } = await api.post<AcceptFriendRequestData>(`/friends/requests/accept/${requestId}`, null, {
            headers: {
                Authorization: `Bearer ${session}`
            }
        });

        return data;
    }

    static async cancelFriendRequest({ session, requestId }: CancelFriendRequestParams): Promise<CancelFriendRequestData> {
        const { data } = await api.delete<CancelFriendRequestData>(`/friends/requests/sent/${requestId}`, {
            headers: {
                Authorization: `Bearer ${session}`
            }
        });

        return data;
    }

    static async rejectFriendRequest({ session, requestId }: RejectFriendRequestParams): Promise<RejectFriendRequestData> {
        const { data } = await api.delete<RejectFriendRequestData>(`/friends/requests/${requestId}`, {
            headers: {
                Authorization: `Bearer ${session}`
            }
        });

        return data;
    }

    static async deleteFriend({ session, friendshipId }: DeleteFriendParams): Promise<DeleteFriendData['data']> {
        const { data } = await api.delete<DeleteFriendData>(`/friends/${friendshipId}`, {
            headers: {
                Authorization: `Bearer ${session}`
            }
        });

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
