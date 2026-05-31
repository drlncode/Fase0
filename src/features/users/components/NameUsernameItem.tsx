import { cn } from '@shared/utils/cn';

interface NameUsernameItemProps {
    name: string;
    username: string;
    className?: string;
    classNameForName?: string;
    classNameForUsername?: string;
}

export function NameUsernameItem({ name, username, className, classNameForName, classNameForUsername }: NameUsernameItemProps) {
    return (
        <div className={cn('flex h-full flex-1 items-center overflow-hidden', className)}>
            <div className='flex min-w-0 flex-1 flex-col text-primary/75'>
                <p className={cn('min-w-0 truncate font-medium', classNameForName)}>{name}</p>
                <p className={cn('min-w-0 truncate text-xs text-primary/60', classNameForUsername)}>@{username}</p>
            </div>
        </div>
    );
}
