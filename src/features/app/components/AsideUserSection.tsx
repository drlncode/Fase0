import { useValidAuth } from '@auth/hooks/useValidAuth';
import { useAvatarUrl } from '@shared/hooks/useAvatarUrl';
import { cn } from '@shared/utils/cn';
import { Avatar } from '@shared/components/Avatar';
import { SelectorIcon } from '@/shared/components/ui/Icons';

export function AsideUserSection({ collapsed }: { collapsed: boolean }) {
    const { user: { _id, name, username, avatar } } = useValidAuth();
    const { url } = useAvatarUrl(avatar, _id);

    const fadeClass = collapsed
        ? 'opacity-0 transition-opacity duration-75'
        : 'opacity-100 transition-opacity duration-150 delay-100';

    return (
        <section
            className={cn(
                'group mt-1.5 cursor-pointer rounded-lg',
                'flex items-center gap-2 p-1.5',
                'transition-colors duration-150 hover:bg-surface active:scale-[0.98]'
            )}
        >

            <div className="h-9 w-9 flex-none">
                <Avatar
                    url={url}
                    userUrlStatus={avatar}
                    alt={`${name}'s avatar`}
                    name={name}
                    className="h-full w-full rounded-full"
                />
            </div>

            <div className={cn(
                'min-w-0 flex-1 text-start',
                fadeClass
            )}>
                <p className="truncate text-sm font-semibold text-primary">
                    {name}
                </p>
                <p className="truncate text-xs text-secondary">
                    @{username}
                </p>
            </div>

            {!collapsed && (
                <div
                    className={cn(
                        'flex-none text-muted',
                        'transition-transform duration-150 ease-out',
                        'group-hover:rotate-180'
                    )}
                >
                    <SelectorIcon size={16} />
                </div>
            )}

        </section>
    );
}