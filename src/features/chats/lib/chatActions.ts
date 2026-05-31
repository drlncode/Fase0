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
    session: string,
    chatId: string
): Promise<ServiceResponse<Chat>> {
    try {
        const data = await ChatService.getChatById({ session, chatId });

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
    session: string,
    params: PaginatedParams
): Promise<ServiceResponse<GetAllChatsResponse>> {
    try {
        const data = await ChatService.getAllChats({ session, params });

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
    session: string,
    guestId: string,
    message: string
): Promise<ServiceResponse<CreateChatResponse>> {
    try {
        const data = await ChatService.createChat({ session, guestId, message });

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
    session: string,
    chatId: string
): Promise<ServiceResponse<MarkAllAsReadResponse>> {
    try {
        const data = await ChatService.markAllAsRead({ session, chatId });

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
    session: string,
    chatId: string
): Promise<ServiceResponse<ClearAllChatMessagesResponse>> {
    try {
        const data = await ChatService.clearAllChatMessages({ session, chatId });

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
    session: string,
    chatId: string,
    toUpdate: UpdatableChatData
): Promise<ServiceResponse<UpdateChatResponse>> {
    try {
        const data = await ChatService.updateChat({ session, chatId, toUpdate });

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
