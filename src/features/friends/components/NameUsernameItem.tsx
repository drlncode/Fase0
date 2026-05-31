interface NameUsernameItemProps {
    name: string;
    username: string;
}

export function NameUsernameItem({ name, username }: NameUsernameItemProps) {
    return (
        <div className='flex h-full flex-1 items-center overflow-hidden'>
            <div className='flex min-w-0 flex-1 flex-col text-primary/75'>
                <p className='min-w-0 truncate font-medium'>{name}</p>
                <p className='min-w-0 truncate text-xs text-primary/60'>@{username}</p>
            </div>
        </div>
    );
}
