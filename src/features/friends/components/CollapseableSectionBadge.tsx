import { cn } from '@/shared/utils/cn';

export function CollapseableSectionBadge({ children }: { children: React.ReactNode }) {
    return (
        <span
            className={cn(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold',
                'bg-badge text-secondary',
                'transition-colors duration-200 ease-out group-hover/aside_link:text-primary'
            )}
        >
            {children}
        </span>
    );
}
