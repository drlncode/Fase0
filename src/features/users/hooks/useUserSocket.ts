import { useEffect } from 'react';
import { useSocket } from '@/shared/hooks/useSocket';
import { useAvatarCacheStore } from '@shared/store/useAvatarCacheStore';
import { useChatStore } from '@chats/store/useChatStore';
import { useFriendsStore } from '@friends/store/useFriendsStore';

import type { UserProfileUpdatedEvent, UserAvatarUpdatedEvent } from '@shared/types/socketEvent.types';
import type { UserPublicProfile } from '@users/types/user.types';

function applyUserProfileToStores(user: UserPublicProfile) {
    useChatStore.setState((state) => {
        let chatsChanged = false;
        const chats = state.chats.map((chat) => {
            if (chat.participant._id !== user._id) return chat;
            chatsChanged = true;
            return {
                ...chat,
                participant: {
                    ...chat.participant,
                    name: user.name,
                    username: user.username,
                    avatar: user.avatar
                }
            };
        });

        const activeChat = state.activeChat?._id
            ? (state.activeChat.participant._id === user._id
                ? {
                    ...state.activeChat,
                    participant: {
                        ...state.activeChat.participant,
                        name: user.name,
                        username: user.username,
                        avatar: user.avatar
                    }
                }
                : state.activeChat)
            : state.activeChat;

        if (!chatsChanged && activeChat === state.activeChat) return state;

        return {
            ...state,
            chats,
            activeChat
        };
    });

    useFriendsStore.setState((state) => {
        let changed = false;

        const friends = state.friends.map((friendship) => {
            if (friendship.friend._id !== user._id) return friendship;
            changed = true;
            return {
                ...friendship,
                friend: {
                    ...friendship.friend,
                    name: user.name,
                    username: user.username,
                    avatar: user.avatar
                }
            };
        });

        const friendsRequests = state.friendsRequests.map((request) => {
            if (request.sender._id !== user._id) return request;
            changed = true;
            return {
                ...request,
                sender: {
                    ...request.sender,
                    name: user.name,
                    username: user.username,
                    avatar: user.avatar
                }
            };
        });

        const friendsSentRequests = state.friendsSentRequests.map((request) => {
            if (request.receiver._id !== user._id) return request;
            changed = true;
            return {
                ...request,
                receiver: {
                    ...request.receiver,
                    name: user.name,
                    username: user.username,
                    avatar: user.avatar
                }
            };
        });

        if (!changed) return state;

        return {
            ...state,
            friends,
            friendsRequests,
            friendsSentRequests
        };
    });
}

export function useUserSocket() {
    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;

        const handleUserProfileUpdated = ({ user }: UserProfileUpdatedEvent) => {
            applyUserProfileToStores(user);
            useAvatarCacheStore.getState().invalidate(user._id);
        };

        const handleUserAvatarUpdated = ({ user }: UserAvatarUpdatedEvent) => {
            applyUserProfileToStores(user);
            useAvatarCacheStore.getState().invalidate(user._id);
        };

        socket.on('user:profile_updated', handleUserProfileUpdated);
        socket.on('user:avatar_updated', handleUserAvatarUpdated);

        return () => {
            socket.off('user:profile_updated', handleUserProfileUpdated);
            socket.off('user:avatar_updated', handleUserAvatarUpdated);
        };
    }, [socket]);
}
