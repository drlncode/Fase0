import type { Chat } from '@chats/types/chat.types';
import type { Message, VisibleMessage } from '@messages/types/message.types';
import type { Friendship, FriendshipRequest } from '@friends/types/friends.types';
import type { UserPublicProfile } from '@users/types/user.types';

export interface EventRelation {
    chatId?: string;
    messageId?: string;
    friendshipId?: string;
    requestId?: string;
}

export interface ChatCreatedEvent {
    by: string;
    to: string;
    relatedWith: EventRelation;
    chat: Chat;
}

export interface ChatUpdatedEvent {
    by: string;
    to: string;
    relatedWith: EventRelation;
    chat: Chat | null;
}

export interface ChatReadAllEvent {
    chatId: string;
    messageIds: string[];
}

export interface MessageCreatedEvent {
    by: string;
    to: string;
    relatedWith: EventRelation;
    message: Message;
    temp_id: string | null;
}

export interface MessageUpdatedEvent {
    by: string;
    to: string;
    relatedWith: EventRelation;
    message: VisibleMessage | null;
}

export interface MessageRemovedEvent {
    chatId: string;
    messageId: string;
}

export interface FriendRequestSentEvent {
    by: string;
    to: string;
    request: {
        _id: string;
        receiver: UserPublicProfile;
        createdAt: number;
    };
}

export interface FriendRequestReceivedEvent {
    by: string;
    to: string;
    request: FriendshipRequest;
}

export interface FriendRequestAcceptedEvent {
    by: string;
    to: string;
    friendship: Friendship;
}

export interface FriendRequestRejectedEvent {
    by: string;
    to: string;
    requestId: string;
    from: UserPublicProfile;
}

export interface FriendRemovedEvent {
    by: string;
    to: string;
    friendId: string;
}

export interface FriendRequestCancelledEvent {
    by: string;
    to: string;
    requestId: string;
    from: UserPublicProfile;
}

export interface UserProfileUpdatedEvent {
    by: string;
    to: string;
    user: UserPublicProfile;
}

export interface UserAvatarUpdatedEvent {
    by: string;
    to: string;
    user: UserPublicProfile;
}

export interface FriendUpdatedEvent {
    friendship: Friendship;
}
