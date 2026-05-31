import { isAxiosError } from 'axios';
import { usersApiService } from '@users/service/users.service';

import type {
    ServiceResponse,
    AwaitedReturn
} from '@shared/types/global.types';
import type { UpdateUserBody } from '@users/types/user.types';

export async function getUserByIdAction(userId: string): Promise<
    ServiceResponse<AwaitedReturn<typeof usersApiService.getUserById>>
> {
    try {
        const data = await usersApiService.getUserById({ userId });

        return {
            success: true,
            data
        }
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                success: false,
                error
            }
        }
    }

    return {
        success: false
    }
}

export async function getUsernameAvailabilityAction(username: string): Promise<
    ServiceResponse<AwaitedReturn<typeof usersApiService.getUsernameAvailability>>
> {
    try {
        const data = await usersApiService.getUsernameAvailability(username);

        return {
            success: true,
            data
        }
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                success: false,
                error
            }
        }
    }

    return {
        success: false
    }
}

export async function getUsersByUsernameAction(
    username: string,
    sessionId: string,
    params?: { page?: number; limit?: number }
): Promise<
    ServiceResponse<AwaitedReturn<typeof usersApiService.getUsersByUsername>>
> {
    try {
        const data = await usersApiService.getUsersByUsername({
            username,
            sessionId,
            params
        });

        return {
            success: true,
            data
        }
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                success: false,
                error
            }
        }
    }

    return {
        success: false
    }
}

export async function updateUserAction(
    sessionId: string,
    body: UpdateUserBody
): Promise<
    ServiceResponse<AwaitedReturn<typeof usersApiService.updateUser>>
> {
    try {
        const data = await usersApiService.updateUser({ sessionId, body });

        return {
            success: true,
            data
        }
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                success: false,
                error
            }
        }
    }

    return {
        success: false
    }
}

export async function deleteUserAction(sessionId: string): Promise<
    ServiceResponse<void>
> {
    try {
        await usersApiService.deleteUser({ sessionId });

        return {
            success: true,
            data: void 0
        }
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                success: false,
                error
            }
        }
    }

    return {
        success: false
    }
}
