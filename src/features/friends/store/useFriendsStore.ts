import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import type { Friendship, FriendshipRequest, FriendshipRequestSent, FriendsStore } from '@friends/types/friends.types';

const FRIENDS_FETCH_INITIAL: FriendsStore['friendsFetch'] = {
    status: { status: 'idle' },
    pagination: { page: 1, limit: Number(import.meta.env.VITE_FRIENDS_PER_PAGE) || 20, total: null }
};

const FRIENDS_REQUESTS_FETCH_INITIAL: FriendsStore['friendsRequestsFetch'] = {
    status: { status: 'idle' },
    pagination: { page: 1, limit: Number(import.meta.env.VITE_FRIENDS_PER_PAGE) || 20, total: null }
};

const FRIENDS_SENT_REQUESTS_FETCH_INITIAL: FriendsStore['friendsSentRequestsFetch'] = {
    status: { status: 'idle' },
    pagination: { page: 1, limit: Number(import.meta.env.VITE_FRIENDS_PER_PAGE) || 20, total: null }
};

export const useFriendsStore = create(
    subscribeWithSelector<FriendsStore>((set, get) => ({
        friends: [],
        friendsRequests: [],
        friendsSentRequests: [],
        friendsFetch: { ...FRIENDS_FETCH_INITIAL },
        friendsRequestsFetch: { ...FRIENDS_REQUESTS_FETCH_INITIAL },
        friendsSentRequestsFetch: { ...FRIENDS_SENT_REQUESTS_FETCH_INITIAL },

        setFriends: (newFriends) => set((state) => {
            const friendMap = new Map(state.friends.map(f => [f._id, f]));
            newFriends.forEach(friend => friendMap.set(friend._id, friend));
            return { friends: Array.from(friendMap.values()) };
        }),

        setFriendsSuccess: (friends: Friendship[]) => set((state) => ({
            friends,
            friendsFetch: { ...state.friendsFetch, status: { status: 'success' } }
        })),

        findFriend: (friendId: string) => {
            return get().friends.find(f => f.friend._id === friendId) ?? null;
        },

        setFriendsRequests: (friendsRequests: FriendshipRequest[]) => set({ friendsRequests }),

        setFriendsRequestsSuccess: (friendsRequests: FriendshipRequest[]) => set((state) => ({
            friendsRequests,
            friendsRequestsFetch: { ...state.friendsRequestsFetch, status: { status: 'success' } }
        })),

        addFriend: (friend: Friendship) => set((state) => {
            if (state.friends.some(f => f._id === friend._id)) return state;
            return { friends: [ friend, ...state.friends ] };
        }),

        updateFriend: (updatedFriend: Friendship) => set((state) => {
            const friendMap = new Map(state.friends.map(f => [f._id, f]));
            friendMap.set(updatedFriend._id, updatedFriend);
            return { friends: Array.from(friendMap.values()) };
        }),

        removeFriend: (friendshipId: string) => set((state) => ({
            friends: state.friends.filter(f => f._id !== friendshipId)
        })),

        addFriendRequest: (request: FriendshipRequest) => set((state) => {
            const requestsMap = new Map(state.friendsRequests.map(r => [r._id, r]));
            requestsMap.set(request._id, request);
            return { friendsRequests: Array.from(requestsMap.values()) };
        }),

        removeFriendRequest: (requestId: string) => set((state) => ({
            friendsRequests: state.friendsRequests.filter(r => r._id !== requestId)
        })),

        setFriendsFetchStatus: (friendsFetchStatus: FriendsStore['friendsFetch']['status']) => set((state) => ({
            friendsFetch: { ...state.friendsFetch, status: friendsFetchStatus }
        })),

        setFriendsFetchPagination: (pagination) => set((state) => ({
            friendsFetch: { ...state.friendsFetch, pagination: { ...state.friendsFetch.pagination, ...pagination } }
        })),

        incrementFriendsFetchTotal: () => set((state) => ({
            friendsFetch: { ...state.friendsFetch, pagination: { ...state.friendsFetch.pagination, total: (state.friendsFetch.pagination.total ?? 0) + 1 } }
        })),

        decrementFriendsFetchTotal: () => set((state) => ({
            friendsFetch: { ...state.friendsFetch, pagination: { ...state.friendsFetch.pagination, total: Math.max(0, (state.friendsFetch.pagination.total ?? 1) - 1) } }
        })),

        setFriendsRequestsFetchStatus: (friendsRequestsFetchStatus: FriendsStore['friendsRequestsFetch']['status']) => set((state) => ({
            friendsRequestsFetch: { ...state.friendsRequestsFetch, status: friendsRequestsFetchStatus }
        })),

        setFriendsRequestsFetchPagination: (pagination) => set((state) => ({
            friendsRequestsFetch: { ...state.friendsRequestsFetch, pagination: { ...state.friendsRequestsFetch.pagination, ...pagination } }
        })),

        incrementFriendsRequestsFetchTotal: () => set((state) => ({
            friendsRequestsFetch: { ...state.friendsRequestsFetch, pagination: { ...state.friendsRequestsFetch.pagination, total: (state.friendsRequestsFetch.pagination.total ?? 0) + 1 } }
        })),

        decrementFriendsRequestsFetchTotal: () => set((state) => ({
            friendsRequestsFetch: { ...state.friendsRequestsFetch, pagination: { ...state.friendsRequestsFetch.pagination, total: Math.max(0, (state.friendsRequestsFetch.pagination.total ?? 1) - 1) } }
        })),

        setFriendsSentRequests: (friendsSentRequests: FriendshipRequestSent[]) => set((state) => {
            const requestMap = new Map(state.friendsSentRequests.map(r => [r._id, r]));
            friendsSentRequests.forEach(request => requestMap.set(request._id, request));
            return { friendsSentRequests: Array.from(requestMap.values()) };
        }),

        setFriendsSentRequestsSuccess: (friendsSentRequests: FriendshipRequestSent[]) => set((state) => ({
            friendsSentRequests,
            friendsSentRequestsFetch: { ...state.friendsSentRequestsFetch, status: { status: 'success' } }
        })),

        setFriendsSentRequestsFetchStatus: (friendsSentRequestsFetchStatus: FriendsStore['friendsSentRequestsFetch']['status']) => set((state) => ({
            friendsSentRequestsFetch: { ...state.friendsSentRequestsFetch, status: friendsSentRequestsFetchStatus }
        })),

        setFriendsSentRequestsFetchPagination: (pagination) => set((state) => ({
            friendsSentRequestsFetch: { ...state.friendsSentRequestsFetch, pagination: { ...state.friendsSentRequestsFetch.pagination, ...pagination } }
        })),

        incrementFriendsSentRequestsFetchTotal: () => set((state) => ({
            friendsSentRequestsFetch: { ...state.friendsSentRequestsFetch, pagination: { ...state.friendsSentRequestsFetch.pagination, total: (state.friendsSentRequestsFetch.pagination.total ?? 0) + 1 } }
        })),

        decrementFriendsSentRequestsFetchTotal: () => set((state) => ({
            friendsSentRequestsFetch: { ...state.friendsSentRequestsFetch, pagination: { ...state.friendsSentRequestsFetch.pagination, total: Math.max(0, (state.friendsSentRequestsFetch.pagination.total ?? 1) - 1) } }
        })),

        addFriendSentRequest: (request: FriendshipRequestSent) => set((state) => {
            const exists = state.friendsSentRequests.some(r => r._id === request._id);
            if (exists) return state;
            return { friendsSentRequests: [ request, ...state.friendsSentRequests ] };
        }),

        removeFriendSentRequest: (requestId: string) => set((state) => ({
            friendsSentRequests: state.friendsSentRequests.filter(r => r._id !== requestId)
        })),

        reset: () => set({
            friends: [],
            friendsRequests: [],
            friendsSentRequests: [],
            friendsFetch: { ...FRIENDS_FETCH_INITIAL },
            friendsRequestsFetch: { ...FRIENDS_REQUESTS_FETCH_INITIAL },
            friendsSentRequestsFetch: { ...FRIENDS_SENT_REQUESTS_FETCH_INITIAL }
        })
    }))
);

let isSortingFriends = false;
useFriendsStore.subscribe(
    ({ friends }) => friends,
    (friends) => {
        if (isSortingFriends) return;
        
        const sorted = [...friends].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const isSameOrder = friends.every((friend, i) => friend._id === sorted[i]?._id);
        
        if (!isSameOrder) {
            isSortingFriends = true;
            useFriendsStore.setState({ friends: sorted });
            setTimeout(() => { isSortingFriends = false; }, 0);
        }
    }
);

let isSortingRequests = false;
useFriendsStore.subscribe(
    ({ friendsRequests }) => friendsRequests,
    (friendsRequests) => {
        if (isSortingRequests) return;
        
        const sorted = [...friendsRequests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const isSameOrder = friendsRequests.every((request, i) => request._id === sorted[i]?._id);
        
        if (!isSameOrder) {
            isSortingRequests = true;
            useFriendsStore.setState({ friendsRequests: sorted });
            setTimeout(() => { isSortingRequests = false; }, 0);
        }
    }
);

let isSortingSentRequests = false;
useFriendsStore.subscribe(
    ({ friendsSentRequests }) => friendsSentRequests,
    (friendsSentRequests) => {
        if (isSortingSentRequests) return;
        
        const sorted = [...friendsSentRequests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const isSameOrder = friendsSentRequests.every((request, i) => request._id === sorted[i]?._id);
        
        if (!isSameOrder) {
            isSortingSentRequests = true;
            useFriendsStore.setState({ friendsSentRequests: sorted });
            setTimeout(() => { isSortingSentRequests = false; }, 0);
        }
    }
);
