import { cn } from '@/shared/utils/cn';

interface ChatHeaderProps {
    label: string;
    isActive: boolean;
    info?: number | string;
    onClick?: () => void;
}

export function ChatBadge({ label, isActive, info, onClick }: ChatHeaderProps) {
    return (
        <button onClick={onClick} className={cn('flex items-center justify-center gap-1.5 rounded-lg border border-default px-2 py-1 text-sm transition-all duration-150 hover:cursor-pointer hover:bg-subtle/65 hover:text-primary/65 active:scale-[0.97]',
            {
                'bg-subtle/75 text-primary/75': isActive,
            }
        )}>
            <span>
                {label}
            </span>
            {!!info && (
                <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-badge text-[10px] font-medium">
                    {info}
                </span>
            )}
        </button>
    );
}
