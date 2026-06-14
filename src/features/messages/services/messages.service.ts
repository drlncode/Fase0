import api from '@/lib/axios';

import type { PaginatedParams, PaginatedResponse } from '@shared/types/global.types';
import type { VisibleMessage, PublicMessage, CreateMessageBody, UpdateMessageBody, MarkBatchAsReadBody } from '@messages/types/message.types';

export type GetMessagesParams = { chatId: string; params: PaginatedParams };
export type GetMessagesResponse = PaginatedResponse<{ messages: VisibleMessage[] }>;
export type GetMessagesReturnType = Promise<GetMessagesResponse>;

export type GetMessageByIdParams = { chatId: string; messageId: string };
export type GetMessageByIdResponse = VisibleMessage;
export type GetMessageByIdReturnType = Promise<GetMessageByIdResponse>;

export type CreateMessageParams = { body: CreateMessageBody };
export type CreateMessageResponse = {
    message: PublicMessage;
    temp_id: string | null;
};
export type CreateMessageReturnType = Promise<CreateMessageResponse>;

export type UpdateMessageParams = { messageId: string; body: UpdateMessageBody };
export type UpdateMessageResponse = VisibleMessage;
export type UpdateMessageReturnType = Promise<UpdateMessageResponse>;

export type MarkBatchAsReadParams = { body: MarkBatchAsReadBody };
export type MarkBatchAsReadResponse = { modifiedCount: number };
export type MarkBatchAsReadReturnType = Promise<MarkBatchAsReadResponse>;

export class MessageService {
    static async getMessages({ chatId, params }: GetMessagesParams): GetMessagesReturnType {
        const { data } = await api.get<GetMessagesResponse>(`/messages/chat/${chatId}`, { params });

        return data;
    }

    static async getMessageById({ chatId, messageId }: GetMessageByIdParams): GetMessageByIdReturnType {
        const { data: { data } } = await api.get<{ data: { message: VisibleMessage } }>(
            `/messages/chat/${chatId}/message/${messageId}`
        );

        return data.message;
    }

    static async createMessage({ body }: CreateMessageParams): CreateMessageReturnType {
        const { data: { data } } = await api.post<{ data: { message: PublicMessage; temp_id: string | null } }>(
            '/messages',
            body
        );

        return {
            message: data.message,
            temp_id: data.temp_id
        };
    }

    static async updateMessage({ messageId, body }: UpdateMessageParams): UpdateMessageReturnType {
        const { data: { data } } = await api.patch<{ data: { message: VisibleMessage } }>(
            `/messages/${messageId}`,
            body
        );

        return data.message;
    }

    static async markBatchAsRead({ body }: MarkBatchAsReadParams): MarkBatchAsReadReturnType {
        const { data: { data } } = await api.patch<{ data: MarkBatchAsReadResponse }>(
            '/messages/read-batch',
            body
        );

        return data;
    }
}
