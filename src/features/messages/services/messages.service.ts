import api from '@/lib/axios';

import type { PaginatedParams, PaginatedResponse } from '@shared/types/global.types';
import type { VisibleMessage, PublicMessage, CreateMessageBody, UpdateMessageBody, MarkBatchAsReadBody } from '@messages/types/message.types';

export type GetMessagesParams = { chatId: string; session: string; params: PaginatedParams };
export type GetMessagesResponse = PaginatedResponse<{ messages: VisibleMessage[] }>;
export type GetMessagesReturnType = Promise<GetMessagesResponse>;

export type GetMessageByIdParams = { chatId: string; messageId: string; session: string };
export type GetMessageByIdResponse = VisibleMessage;
export type GetMessageByIdReturnType = Promise<GetMessageByIdResponse>;

export type CreateMessageParams = { session: string; body: CreateMessageBody };
export type CreateMessageResponse = {
    message: PublicMessage;
    temp_id: string | null;
};
export type CreateMessageReturnType = Promise<CreateMessageResponse>;

export type UpdateMessageParams = { session: string; messageId: string; body: UpdateMessageBody };
export type UpdateMessageResponse = VisibleMessage;
export type UpdateMessageReturnType = Promise<UpdateMessageResponse>;

export type MarkBatchAsReadParams = { session: string; body: MarkBatchAsReadBody };
export type MarkBatchAsReadResponse = { modifiedCount: number };
export type MarkBatchAsReadReturnType = Promise<MarkBatchAsReadResponse>;

export class MessageService {
    static async getMessages({ chatId, session, params }: GetMessagesParams): GetMessagesReturnType {
        const { data } = await api.get<GetMessagesResponse>(`/messages/chat/${chatId}`, {
            headers: {
                Authorization: `Bearer ${session}`
            },
            params
        });

        return data;
    }

    static async getMessageById({ chatId, messageId, session }: GetMessageByIdParams): GetMessageByIdReturnType {
        const { data: { data } } = await api.get<{ data: { message: VisibleMessage } }>(
            `/messages/chat/${chatId}/message/${messageId}`,
            {
                headers: {
                    Authorization: `Bearer ${session}`
                }
            }
        );

        return data.message;
    }

    static async createMessage({ session, body }: CreateMessageParams): CreateMessageReturnType {
        const { data: { data } } = await api.post<{ data: { message: PublicMessage; temp_id: string | null } }>(
            '/messages',
            body,
            {
                headers: {
                    Authorization: `Bearer ${session}`
                }
            }
        );

        return {
            message: data.message,
            temp_id: data.temp_id
        };
    }

    static async updateMessage({ session, messageId, body }: UpdateMessageParams): UpdateMessageReturnType {
        const { data: { data } } = await api.patch<{ data: { message: VisibleMessage } }>(
            `/messages/${messageId}`,
            body,
            {
                headers: {
                    Authorization: `Bearer ${session}`
                }
            }
        );

        return data.message;
    }

    static async markBatchAsRead({ session, body }: MarkBatchAsReadParams): MarkBatchAsReadReturnType {
        const { data: { data } } = await api.patch<{ data: MarkBatchAsReadResponse }>(
            '/messages/read-batch',
            body,
            {
                headers: {
                    Authorization: `Bearer ${session}`
                }
            }
        );

        return data;
    }
}
