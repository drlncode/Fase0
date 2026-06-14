import api from '@/lib/axios';

import type { PaginatedParams, PaginatedResponse } from '@shared/types/global.types';
import type { Chat, UpdatableChatData } from '@chats/types/chat.types';

//* getChatById types:
export type GetChatByIdParams = { chatId: string };
export type GetChatByIdResponse = Chat;

//* getAllChats types:
export type GetAllChatsParams = { params: PaginatedParams };
export type GetAllChatsResponse = PaginatedResponse<{ chats: Chat[] }>;
export type GetAllChatsReturnType = Promise<GetAllChatsResponse>;

//* createChat types:
export type CreateChatParams = { guestId: string; message: string };
export type CreateChatResponse = Chat;
export type CreateChatReturnType = Promise<CreateChatResponse>;

//* updateChat types:
export type UpdateChatParams = {
    chatId: string,
    toUpdate: UpdatableChatData
};
export type UpdateChatResponse = Chat | null;
export type UpdateChatReturnType = Promise<UpdateChatResponse>;

//* markAllAsRead types:
export type MarkAllAsReadParams = {
    chatId: string
};
export type MarkAllAsReadResponse = { modifiedCount: number };
export type MarkAllAsReadReturnType = Promise<MarkAllAsReadResponse>;

//* clearAllChatMessages types:
export type ClearAllChatMessagesParams = {
    chatId: string
}
export type ClearAllChatMessagesResponse = null;
export type ClearAllChatMessagesReturnType = Promise<ClearAllChatMessagesResponse>;

export class ChatService {
    static async getChatById({ chatId }: GetChatByIdParams): Promise<GetChatByIdResponse> {
        const { data: { data } } = await api.get<{ data: { chat: Chat } }>(`/chats/${chatId}`);

        return data.chat;
    }

    static async getAllChats({ params }: GetAllChatsParams): GetAllChatsReturnType {
        const { data } = await api.get<GetAllChatsResponse>('/chats', { params });

        return data;
    };

    static async createChat({ guestId, message }: CreateChatParams): CreateChatReturnType {
        const { data: { data } } = await api.post<{ data: { chat: CreateChatResponse } }>('/chats', { guest: guestId, message });

        return data.chat;
    };

    static async markAllAsRead({ chatId }: MarkAllAsReadParams): MarkAllAsReadReturnType {
        const { data: { data } } = await api.patch<{ data: MarkAllAsReadResponse }>(`/chats/${chatId}/read-all`);

        return data;
    }

    static async clearAllChatMessages({ chatId }: ClearAllChatMessagesParams): ClearAllChatMessagesReturnType {
        const { data: { data } } = await api.patch<{ data: ClearAllChatMessagesResponse }>(`/chats/${chatId}/clear`);

        return data;
    }

    static async updateChat({ chatId, toUpdate }: UpdateChatParams): UpdateChatReturnType {
        const { data: { data } } = await api.patch<{ data: { chat: UpdateChatResponse } | null }>(`/chats/${chatId}`, { ...toUpdate });

        return data?.chat ?? null;
    }
}
