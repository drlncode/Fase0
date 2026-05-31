import { MessageService } from '@messages/services/messages.service';
import { isAxiosError } from 'axios';

import type { ServiceResponse, PaginatedParams } from '@shared/types/global.types';
import type {
    VisibleMessage,
    CreateMessageBody,
    UpdateMessageBody,
    MarkBatchAsReadBody
} from '@messages/types/message.types';
import type {
    GetMessagesResponse,
    CreateMessageResponse,
    UpdateMessageResponse,
    MarkBatchAsReadResponse
} from '@messages/services/messages.service';

export async function getMessages(
    session: string,
    chatId: string,
    params: PaginatedParams
): Promise<ServiceResponse<GetMessagesResponse>> {
    try {
        const data = await MessageService.getMessages({ session, chatId, params });

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

export async function getMessageById(
    session: string,
    chatId: string,
    messageId: string
): Promise<ServiceResponse<VisibleMessage>> {
    try {
        const data = await MessageService.getMessageById({ session, chatId, messageId });

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

export async function createMessage(
    session: string,
    body: CreateMessageBody
): Promise<ServiceResponse<CreateMessageResponse>> {
    try {
        const data = await MessageService.createMessage({ session, body });

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

export async function updateMessage(
    session: string,
    messageId: string,
    body: UpdateMessageBody
): Promise<ServiceResponse<UpdateMessageResponse>> {
    try {
        const data = await MessageService.updateMessage({ session, messageId, body });

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

export async function markBatchAsRead(
    session: string,
    body: MarkBatchAsReadBody
): Promise<ServiceResponse<MarkBatchAsReadResponse>> {
    try {
        const data = await MessageService.markBatchAsRead({ session, body });

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
