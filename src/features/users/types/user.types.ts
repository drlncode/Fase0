import type { PaginatedParams } from '@shared/types/global.types';

export type BaseUserCredentials = {
    email: string;
    password: string;
}

export type InputUserCredentials = BaseUserCredentials & {
    name: string;
    username: string;
}

export type ActiveUser = Omit<InputUserCredentials, 'password'> & {
    _id: string;
    avatar: string | null;
    createdAt: number;
    updatedAt: number;
}

export type UserPublicProfile = Omit<ActiveUser, 'email' | 'updatedAt'>;
export type SearchedUserPublicProfile = UserPublicProfile & {
    relationship: {
        isFriend: boolean;
        onRequest: 'sent' | 'received' | null;
    }
}

export type PublicUserProfile = Pick<ActiveUser, '_id' | 'name' | 'username' | 'avatar' | 'createdAt'>;

// * API Service Params Types

export type GetUserByIdParams = {
    userId: string;
}
export type GetUsersByUsernameParams = {
    username: string;
    sessionId: string;
    params?: PaginatedParams;
}
export type DeleteUserParams = {
    sessionId: string;
}

export type UpdateUserBody = Partial<{
    name: string;
    username: string;
    email: string;
    password: string;
}>;

export type UpdateUserParams = {
    sessionId: string;
    body: UpdateUserBody;
}
