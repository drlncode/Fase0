import api from '@/lib/axios';

import type { PaginatedParams, PaginatedResponse } from '@shared/types/global.types';
import type { Chat, UpdatableChatData } from '@chats/types/chat.types';

//* getChatById types:
export type GetChatByIdParams = { chatId: string, session: string };
export type GetChatByIdResponse = Chat;

//* getAllChats types:
export type GetAllChatsParams = { session: string, params: PaginatedParams };
export type GetAllChatsResponse = PaginatedResponse<{ chats: Chat[] }>;
export type GetAllChatsReturnType = Promise<GetAllChatsResponse>;

//* createChat types:
export type CreateChatParams = { session: string; guestId: string; message: string };
export type CreateChatResponse = Chat;
export type CreateChatReturnType = Promise<CreateChatResponse>;

//* updateChat types:
export type UpdateChatParams = {
    session: string,
    chatId: string,
    toUpdate: UpdatableChatData
};
export type UpdateChatResponse = Chat | null;
export type UpdateChatReturnType = Promise<UpdateChatResponse>;

//* markAllAsRead types:
export type MarkAllAsReadParams = {
    session: string,
    chatId: string
};
export type MarkAllAsReadResponse = { modifiedCount: number };
export type MarkAllAsReadReturnType = Promise<MarkAllAsReadResponse>;

//* clearAllChatMessages types:
export type ClearAllChatMessagesParams = {
    session: string,
    chatId: string
}
export type ClearAllChatMessagesResponse = null;
export type ClearAllChatMessagesReturnType = Promise<ClearAllChatMessagesResponse>;

export class ChatService {
    static async getChatById({ chatId, session }: GetChatByIdParams): Promise<GetChatByIdResponse> {
        const { data: { data } } = await api.get<{ data: { chat: Chat } }>(`/chats/${chatId}`, {
            headers: {
                'Authorization': `Bearer ${session}`
            }
        });

        return data.chat;
    }

    static async getAllChats({ session, params }: GetAllChatsParams): GetAllChatsReturnType {
        const { data } = await api.get<GetAllChatsResponse>('/chats', {
            headers: {
                'Authorization': `Bearer ${session}`
            },
            params
        });

        return data;
    };

    static async createChat({ session, guestId, message }: CreateChatParams): CreateChatReturnType {
        const { data: { data } } = await api.post<{ data: { chat: CreateChatResponse } }>('/chats', { guest: guestId, message }, {
            headers: {
                Authorization: `Bearer ${session}`
            }
        });

        return data.chat;
    };

    static async markAllAsRead({ session, chatId }: MarkAllAsReadParams): MarkAllAsReadReturnType {
        const { data: { data } } = await api.patch<{ data: MarkAllAsReadResponse }>(`/chats/${chatId}/read-all`, null, {
            headers: {
                Authorization: `Bearer ${session}`
            }
        });

        return data;
    }

    static async clearAllChatMessages({ session, chatId }: ClearAllChatMessagesParams): ClearAllChatMessagesReturnType {
        const { data: { data } } = await api.patch<{ data: ClearAllChatMessagesResponse }>(`/chats/${chatId}/clear`, null, {
            headers: {
                Authorization: `Bearer ${session}`
            }
        });

        return data;
    }

    static async updateChat({ session, chatId, toUpdate }: UpdateChatParams): UpdateChatReturnType {
        const { data: { data } } = await api.patch<{ data: { chat: UpdateChatResponse } | null }>(`/chats/${chatId}`, { ...toUpdate }, {
            headers: {
                Authorization: `Bearer ${session}`
            }
        });

        return data?.chat ?? null;
    }
}
