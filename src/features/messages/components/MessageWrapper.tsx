import { cn } from '@shared/utils/cn';

interface MessageWrapperProps {
    side: 'received' | 'sent';
    className?: string;
    children: React.ReactNode;
}

export function MessageWrapper({ side, className, children }: MessageWrapperProps) {
    return (
        <div className={cn('flex w-full px-11', {
            'justify-start': side === 'received',
            'justify-end': side === 'sent',
        }, className)}>
            {children}
        </div>
    );
}
