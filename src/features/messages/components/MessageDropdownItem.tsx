import { cn } from '@/shared/utils/cn';
import { useContext } from 'react';
import { MessageDropdownContext } from './MessageDropdown';

interface MessageDropdownItemProps {
    label?: React.ReactNode;
    icon?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    danger?: boolean;
    closeOnClick?: boolean;
    className?: string;
    children?: React.ReactNode;
}

export function MessageDropdownItem({
    label,
    icon,
    onClick,
    disabled = false,
    danger = false,
    closeOnClick = true,
    className = '',
    children
}: MessageDropdownItemProps) {
    const { close } = useContext(MessageDropdownContext);

    const content = children ?? (
        <div className='flex items-center gap-2'>
            {icon && <span>{icon}</span>}
            {label && <span className='flex-1'>{label}</span>}
        </div>
    );

    const baseClasses = disabled
        ? 'cursor-not-allowed text-secondary/60'
        : danger
            ? 'text-danger hover:bg-red-800/20 hover:text-red-300'
            : 'hover:bg-subtle';

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (disabled) return;
        onClick?.();
        if (closeOnClick) close();
    };

    return (
        <button
            role="menuitem"
            className={cn(
                'w-full cursor-pointer rounded px-2 py-1.5 text-left text-xs transition-colors select-none',
                baseClasses,
                className
            )}
            onClick={handleClick}
            disabled={disabled}
        >
            {content}
        </button>
    );
}