import { DoubleCheckIcon, ClockIcon } from '@/shared/components/ui/Icons';

import type { LocalMessageStatus } from '@messages/types/message.types';
import { cn } from '@/shared/utils/cn';

export function MessageStatus({ status, size }: {
    status: LocalMessageStatus,
    size?: number
}) {
    if (status === 'SENT' || status === 'DELETED_FOR_ALL') {
        return null;
    }

    return (
        <span className={cn(status === 'READ_BY_ALL' && 'text-blue-400', 'mt-0.5 flex items-center justify-center')}>
            { (status === 'READ' || status === 'READ_BY_ALL') && <DoubleCheckIcon size={size ?? 24} /> }
            { status === 'SENDING' && <ClockIcon size={14} /> }
        </span>
    );
}
