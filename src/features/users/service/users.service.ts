import api from '@/lib/axios';

import type {
    PublicUserProfile,
    SearchedUserPublicProfile,
    ActiveUser,
    GetUserByIdParams,
    GetUsersByUsernameParams,
    DeleteUserParams,
    UpdateUserParams
} from '@users/types/user.types';
import type { PaginatedResponse } from '@shared/types/global.types';

class UsersApiService {
    async getUserById({ userId }: GetUserByIdParams): Promise<PublicUserProfile> {
        const { data } = await api.get<PublicUserProfile>(
            `/users/${userId}`
        );

        return data;
    }

    async getUsernameAvailability(username: string): Promise<{ isAvailable: boolean }> {
        const { data: { data } } = await api.get<{ data: { isAvailable: boolean } }>(
            `/users/availability/username/${username}`
        );

        return data;
    }

    async getUsersByUsername({ username, sessionId, params }: GetUsersByUsernameParams): Promise<PaginatedResponse<{ users: SearchedUserPublicProfile[] }>> {
        const { data } = await api.get<PaginatedResponse<{ users: SearchedUserPublicProfile[] }>>(
            `/users/search/`, {
                params: {
                    search: username,
                    ...params
                },
                headers: {
                    Authorization: `Bearer ${sessionId}`
                }
            }
        );

        return data;
    }

    async updateUser({ sessionId, body }: UpdateUserParams): Promise<ActiveUser> {
        const { data: { data } } = await api.patch<{ data: { updatedUser: ActiveUser } }>(
            '/users',
            body,
            {
                headers: {
                    Authorization: `Bearer ${sessionId}`
                }
            }
        );

        return data.updatedUser;
    }

    async deleteUser({ sessionId }: DeleteUserParams): Promise<void> {
        await api.delete('/users', {
            headers: {
                Authorization: `Bearer ${sessionId}`
            }
        });
    }
}

export const usersApiService = new UsersApiService();
