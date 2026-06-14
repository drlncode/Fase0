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
    chatId: string,
    params: PaginatedParams
): Promise<ServiceResponse<GetMessagesResponse>> {
    try {
        const data = await MessageService.getMessages({ chatId, params });

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
    chatId: string,
    messageId: string
): Promise<ServiceResponse<VisibleMessage>> {
    try {
        const data = await MessageService.getMessageById({ chatId, messageId });

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
    body: CreateMessageBody
): Promise<ServiceResponse<CreateMessageResponse>> {
    try {
        const data = await MessageService.createMessage({ body });

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
    messageId: string,
    body: UpdateMessageBody
): Promise<ServiceResponse<UpdateMessageResponse>> {
    try {
        const data = await MessageService.updateMessage({ messageId, body });

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
    body: MarkBatchAsReadBody
): Promise<ServiceResponse<MarkBatchAsReadResponse>> {
    try {
        const data = await MessageService.markBatchAsRead({ body });

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
