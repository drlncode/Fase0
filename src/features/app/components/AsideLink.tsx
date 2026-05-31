import { useMatch, useLocation, NavLink } from 'react-router';
import { cn } from '@/shared/utils/cn';

interface AsideLinkProps {
    label: string;
    icon: React.ReactNode;
    to: string;
    end?: boolean;
    extraMatch?: string;
    notification?: string | number;
    className?: string;
    collapsed?: boolean;
}

function useParamsMatch(to: string) {
    const { search } = useLocation();
    const toParams = new URL(to, 'https://drlncode.dev').searchParams;

    // Si el `to` no tiene params, no hay nada que comparar
    if (![...toParams.keys()].length) return true;

    const currentParams = new URLSearchParams(search);
    return [...toParams.entries()].every(
        ([key, value]) => currentParams.get(key) === value
    );
}

export function AsideLink({
    label,
    icon,
    to,
    end,
    extraMatch,
    notification,
    className,
    collapsed = false
}: AsideLinkProps) {
    const extraMatched = useMatch(extraMatch ?? '__no_match__');
    const extraActive = extraMatch ? !!extraMatched : false;
    const paramsMatch = useParamsMatch(to);

    return (
        <NavLink to={to} className={cn('flex', { 'self-center': collapsed })} end={end}>
            {({ isActive }) => {
                const active = (isActive && paramsMatch) || extraActive;

                return (
                    <div
                        className={cn(
                            'group/aside_link relative flex items-center rounded-md border border-transparent',
                            collapsed ? 'justify-between' : 'justify-between',
                            'transition-all duration-200 ease-out',
                            'hover:border-default/75 hover:bg-surface',
                            'active:border-default',
                            'mx-1',
                            'active:scale-[0.98]',
                            {
                                'w-full px-2 py-1.5': !collapsed,
                                'self-center p-2.5': collapsed,
                                'bg-surface text-primary': active,
                            },
                            className
                        )}
                    >
                        <div
                            className={cn(
                                'flex items-center',
                                collapsed ? 'w-full justify-center' : 'gap-2'
                            )}
                        >
                            <span className="flex h-5 w-5 items-center justify-center transition-transform duration-200 ease-out group-hover/aside_link:-translate-y-px group-hover/aside_link:scale-105">
                                {icon}
                            </span>

                            {!collapsed && (
                                <span className="leading-none whitespace-nowrap transition-colors duration-200 group-hover/aside_link:text-primary">
                                    {label}
                                </span>
                            )}
                        </div>

                        {!!notification && (
                            <span
                                className={cn(
                                    'flex items-center justify-center rounded-full text-[11px] font-semibold',
                                    'bg-badge text-secondary',
                                    'transition-colors duration-200 ease-out group-hover/aside_link:text-primary',
                                    collapsed
                                        ? 'absolute -top-1 -right-1 h-4 min-w-4 px-1'
                                        : 'h-5 min-w-5 px-1'
                                )}
                            >
                                {notification}
                            </span>
                        )}
                    </div>
                );
            }}
        </NavLink>
    );
}