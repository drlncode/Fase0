import { cn } from '@/shared/utils/cn';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { MessageStatus } from '@messages/ui/MessageStatus';
import { isDeletedMessage } from '@messages/utils/isDeletedMessage';
import type { VisibleMessage } from '@messages/types/message.types';

interface ChatListLastMessageProps {
    message: VisibleMessage | null;
    totalBadges: 0 | 1 | 2 | 3;
}

export function ChatListLastMessage({ message, totalBadges }: ChatListLastMessageProps) {
    const { user: { _id } } = useValidAuth();

    const classesByNumberOfBadges = {
        0: 'max-w-11/12 group-hover:max-w-[87%] group-[.open]:max-w-[87%]',
        1: 'max-w-[90%] group-hover:max-w-[83%] group-[.open]:max-w-[83%]',
        2: 'max-w-[83%] group-hover:max-w-[75%] group-[.open]:max-w-[75%]',
        3: 'max-w-[76%] group-hover:max-w-[68%] group-[.open]:max-w-[68%]',
    }

    return (
        <div className='w-full'>
            <span className={cn('flex items-center justify-start gap-0.5 text-[13.5px] transition-[width] duration-150',
                classesByNumberOfBadges[totalBadges]
            )}>
                { message &&
                    <>
                        { _id === message.senderId && <MessageStatus size={19} status={message.status} /> }
                        <span className={cn('mt-0.5 truncate', isDeletedMessage(message) && 'italic')}>
                            { isDeletedMessage(message) ? 'Mensaje eliminado' : message.content }
                        </span>
                    </>
                }
            </span>
        </div>
    );
}
