import { ChatService } from '@chats/services/chat.service';
import { isAxiosError } from 'axios';

import type { ServiceResponse, PaginatedParams } from '@shared/types/global.types';
import type {
    GetAllChatsResponse,
    CreateChatResponse,
    UpdateChatResponse,
    MarkAllAsReadResponse,
    ClearAllChatMessagesResponse
} from '@chats/services/chat.service';
import type { Chat, UpdatableChatData } from '@chats/types/chat.types';

export async function getChatById(
    chatId: string
): Promise<ServiceResponse<Chat>> {
    try {
        const data = await ChatService.getChatById({ chatId });

        return {
            success: true,
            data
        }
    } catch (error) {
        if (isAxiosError(error)) return {
            success: false,
            error
        }
    }

    return {
        success: false
    }
};

export async function getAllChats(
    params: PaginatedParams
): Promise<ServiceResponse<GetAllChatsResponse>> {
    try {
        const data = await ChatService.getAllChats({ params });

        return {
            success: true,
            data
        }
    } catch (error) {
        if (isAxiosError(error)) return {
            success: false,
            error
        }
    }

    return {
        success: false
    }
};

export async function createChat(
    guestId: string,
    message: string
): Promise<ServiceResponse<CreateChatResponse>> {
    try {
        const data = await ChatService.createChat({ guestId, message });

        return {
            success: true,
            data
        }
    } catch (error) {
        if (isAxiosError(error)) return {
            success: false,
            error
        }
    }

    return {
        success: false
    }
};

export async function markAllAsRead(
    chatId: string
): Promise<ServiceResponse<MarkAllAsReadResponse>> {
    try {
        const data = await ChatService.markAllAsRead({ chatId });

        return {
            success: true,
            data
        }
    } catch (error) {
        if (isAxiosError(error)) return {
            success: false,
            error
        }
    }

    return {
        success: false
    }
}

export async function clearAllChatMessages(
    chatId: string
): Promise<ServiceResponse<ClearAllChatMessagesResponse>> {
    try {
        const data = await ChatService.clearAllChatMessages({ chatId });

        return {
            success: true,
            data
        }
    } catch (error) {
        if (isAxiosError(error)) return {
            success: false,
            error
        }
    }

    return {
        success: false
    }
}

export async function updateChat(
    chatId: string,
    toUpdate: UpdatableChatData
): Promise<ServiceResponse<UpdateChatResponse>> {
    try {
        const data = await ChatService.updateChat({ chatId, toUpdate });

        return {
            success: true,
            data
        }
    } catch (error) {
        if (isAxiosError(error)) return {
            success: false,
            error
        }
    }

    return {
        success: false
    }
};
