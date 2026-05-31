import { MessageStatus } from '@messages/ui/MessageStatus';
import { PencilFilledIcon } from '@/shared/components/ui/Icons';

import type { LocalMessageStatus } from '@messages/types/message.types';

interface MessageInfoProps {
    createdAt: string | number | Date;
    isSender: boolean;
    isEdited: boolean;
    status: LocalMessageStatus;
}

export function MessageInfo({ createdAt, isSender, isEdited, status }: MessageInfoProps) {
    const time = new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return (
        <span className='relative h-fit shrink-0 self-end text-[11px] *:flex *:items-center *:justify-center *:gap-1'>
            <span className='opacity-0'>
                <span>
                    { isEdited && <PencilFilledIcon size={13} /> }
                </span>
                { time }
                { isSender && <MessageStatus status={status} size={16} /> }
            </span>
            <span className='absolute right-px -bottom-1.25 w-full shrink-0'>
                <span className='text-secondary'>
                    { isEdited && <PencilFilledIcon size={13} /> }
                </span>
                { time }
                { isSender && <MessageStatus status={status} size={16} /> }
            </span>
        </span>
    );
}
