import type { FetchState } from '@shared/types/global.types';

export interface Friendship {
    _id: string;
    friend: {
        _id: string;
        name: string;
        username: string;
        avatar: string | null;
    };
    activeChatId: string | null;
    createdAt: number;
    updatedAt: number;
}
export interface FriendshipRequest extends Omit<Friendship, 'friend'> {
    sender: Friendship['friend'];
};
export interface FriendshipRequestSent extends Omit<Friendship, 'friend'> {
    receiver: Friendship['friend'];
}

type FriendsStatus = 
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'fetching' }
    | { status: 'success' }
    | { status: 'error', message: string }

export type FriendsRequestsStatus = FriendsStatus;
export type FriendsSentRequestsStatus = FriendsStatus;

export interface FriendsStore {
    friends: Friendship[];
    friendsFetch: FetchState<FriendsStatus>;
    setFriends: (newFriends: Friendship[]) => void;
    setFriendsFetchStatus: (status: FriendsStatus) => void;
    addFriend: (friend: Friendship) => void;
    findFriend: (friendId: string) => Friendship | null;
    setFriendsSuccess: (friends: Friendship[]) => void;
    setFriendsFetchPagination: (pagination: Partial<FetchState<FriendsStatus>['pagination']>) => void;
    incrementFriendsFetchTotal: () => void;
    decrementFriendsFetchTotal: () => void;
    updateFriend: (friend: Friendship) => void;
    removeFriend: (friendshipId: string) => void;

    friendsRequests: FriendshipRequest[];
    friendsRequestsFetch: FetchState<FriendsRequestsStatus>;
    setFriendsRequests: (requests: FriendshipRequest[]) => void;
    setFriendsRequestsSuccess: (requests: FriendshipRequest[]) => void;
    addFriendRequest: (request: FriendshipRequest) => void;
    setFriendsRequestsFetchStatus: (status: FriendsStore['friendsRequestsFetch']['status']) => void;
    setFriendsRequestsFetchPagination: (pagination: Partial<FetchState<FriendsRequestsStatus>['pagination']>) => void;
    incrementFriendsRequestsFetchTotal: () => void;
    decrementFriendsRequestsFetchTotal: () => void;
    removeFriendRequest: (requestId: string) => void;

    friendsSentRequests: FriendshipRequestSent[];
    friendsSentRequestsFetch: FetchState<FriendsSentRequestsStatus>;
    setFriendsSentRequests: (requests: FriendshipRequestSent[]) => void;
    addFriendSentRequest: (request: FriendshipRequestSent) => void;
    setFriendsSentRequestsSuccess: (requests: FriendshipRequestSent[]) => void;
    setFriendsSentRequestsFetchStatus: (status: FriendsStore['friendsSentRequestsFetch']['status']) => void;
    setFriendsSentRequestsFetchPagination: (pagination: Partial<FetchState<FriendsSentRequestsStatus>['pagination']>) => void;
    incrementFriendsSentRequestsFetchTotal: () => void;
    decrementFriendsSentRequestsFetchTotal: () => void;
    removeFriendSentRequest: (requestId: string) => void;
    reset: () => void;
}
