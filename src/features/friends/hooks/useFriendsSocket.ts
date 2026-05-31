import { useEffect } from 'react';
import { useSocket } from '@/shared/hooks/useSocket';
import { useFriendsStore } from '@friends/store/useFriendsStore';
import { useToast } from '@shared/hooks/useToast';
import { useValidAuth } from '@auth/hooks/useValidAuth';

import type {
    FriendRequestSentEvent,
    FriendRequestReceivedEvent,
    FriendRequestAcceptedEvent,
    FriendRequestRejectedEvent,
    FriendRemovedEvent,
    FriendRequestCancelledEvent,
    FriendUpdatedEvent
} from '@shared/types/socketEvent.types';

export function useFriendsSocket() {
    const { socket } = useSocket();
    const { user: { _id: currentUserId } } = useValidAuth();
    const { info } = useToast();

    useEffect(() => {
        if (!socket) return;

        const handleFriendRequestSent = ({ request }: FriendRequestSentEvent) => {
            if (request.receiver._id === currentUserId) return;
            const store = useFriendsStore.getState();
            store.addFriendSentRequest({
                _id: request._id,
                receiver: {
                    _id: request.receiver._id,
                    name: request.receiver.name,
                    username: request.receiver.username,
                    avatar: request.receiver.avatar
                },
                activeChatId: null,
                createdAt: request.createdAt,
                updatedAt: request.createdAt
            });
            store.incrementFriendsSentRequestsFetchTotal();
        };

        const handleFriendRequestReceived = ({ request }: FriendRequestReceivedEvent) => {
            if (request.sender._id === currentUserId) return;
            const store = useFriendsStore.getState();
            store.addFriendRequest(request);
            store.incrementFriendsRequestsFetchTotal();
            info(`Nueva solicitud de amistad. \nTienes una nueva solicitud de amistad de @${request.sender.username}`);
        };

        const handleFriendRequestAccepted = ({ by, friendship }: FriendRequestAcceptedEvent) => {
            if (friendship.friend._id === currentUserId) return;
            const store = useFriendsStore.getState();
            store.addFriend(friendship);
            store.incrementFriendsFetchTotal();
            store.removeFriendRequest(friendship._id);
            store.decrementFriendsRequestsFetchTotal();
            store.removeFriendSentRequest(friendship._id);
            store.decrementFriendsSentRequestsFetchTotal();
            
            if (by === currentUserId) return;
            info(`Solicitud de amistad aceptada. \n@${friendship.friend.username} ahora es tu amigo.`);
        };

        const handleFriendRequestRejected = ({ requestId }: FriendRequestRejectedEvent) => {
            const store = useFriendsStore.getState();
            store.removeFriendRequest(requestId);
            store.decrementFriendsRequestsFetchTotal();
            store.removeFriendSentRequest(requestId);
            store.decrementFriendsSentRequestsFetchTotal();
        };

        const handleFriendRequestCancelled = ({ requestId }: FriendRequestCancelledEvent) => {
            const store = useFriendsStore.getState();
            store.removeFriendRequest(requestId);
            store.decrementFriendsRequestsFetchTotal();
            store.removeFriendSentRequest(requestId);
            store.decrementFriendsSentRequestsFetchTotal();
        };

        const handleFriendRemoved = ({ friendId }: FriendRemovedEvent) => {
            const store = useFriendsStore.getState();
            store.removeFriend(friendId);
            store.decrementFriendsFetchTotal();
        };

        const handleFriendUpdated = ({ friendship }: FriendUpdatedEvent) => {
            useFriendsStore.getState().updateFriend(friendship);
        };

        socket.on('friend:request_sent', handleFriendRequestSent);
        socket.on('friend:request_received', handleFriendRequestReceived);
        socket.on('friend:request_accepted', handleFriendRequestAccepted);
        socket.on('friend:request_rejected', handleFriendRequestRejected);
        socket.on('friend:request_cancelled', handleFriendRequestCancelled);
        socket.on('friend:removed', handleFriendRemoved);
        socket.on('friend:updated', handleFriendUpdated);

        return () => {
            socket.off('friend:request_sent', handleFriendRequestSent);
            socket.off('friend:request_received', handleFriendRequestReceived);
            socket.off('friend:request_accepted', handleFriendRequestAccepted);
            socket.off('friend:request_rejected', handleFriendRequestRejected);
            socket.off('friend:request_cancelled', handleFriendRequestCancelled);
            socket.off('friend:removed', handleFriendRemoved);
            socket.off('friend:updated', handleFriendUpdated);
        }
    }, [socket, currentUserId, info]);
}
