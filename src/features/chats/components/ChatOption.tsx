import { cn } from '@/shared/utils/cn';
import { useContext } from 'react';
import { ChatOptionsDropdownContext } from './ChatOptionsDropdown';
import type { JSX } from 'react';

interface ChatOptionProps {
    label?: string;
    icon?: JSX.Element;
    disabled?: boolean;
    danger?: boolean;
    handler?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
    awaitHandler?: boolean;
    className?: string;
    children?: React.ReactNode;
    closeOnClick?: boolean;
}

export function ChatOption({ label, icon, disabled, danger, handler, awaitHandler, className = '', children, closeOnClick = true }: ChatOptionProps) {
    const { close } = useContext(ChatOptionsDropdownContext);

    const content = children ?? (
        <div className='flex items-center gap-2'>
            {icon && <span>{icon}</span>}
            {label && <span>{label}</span>}
        </div>
    );

    const baseClasses = disabled 
        ? 'opacity-50 cursor-not-allowed text-secondary/60' 
        : danger 
            ? 'text-danger hover:bg-red-800/20 hover:text-red-300' 
            : 'hover:bg-subtle';

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) return;
        
        e.stopPropagation();
        
        if (awaitHandler) {
            await handler?.(e);
        } else {
            handler?.(e);
        }
        
        if (closeOnClick) close();
    };

    return (
        <button 
            role="menuitem"
            className={cn(
                `w-full cursor-pointer rounded px-2 py-1.5 text-left text-xs transition-colors select-none`,
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
