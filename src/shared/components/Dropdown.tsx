import { cn } from '@/shared/utils/cn';
import { useState, useEffect, useLayoutEffect, useRef, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import {
    ChevronDownIcon,
    ChevronUpIcon
} from '@/shared/components/ui/Icons';

interface DropdownContextType {
    close: () => void;
}

const DropdownContext = createContext<DropdownContextType>({ close: () => {} });

type DropdownPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'right-start' | 'right-end' | 'left-start' | 'left-end';

interface DropdownProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    placement?: DropdownPlacement;
    minWidth?: number;
    triggerClassName?: string;
    onOpenChange?: (open: boolean) => void;
}

function getPlacementCoords(
    placement: DropdownPlacement,
    triggerRect: DOMRect,
    dropdownWidth: number,
    dropdownHeight: number
): { top: number; left: number } {
    const { top: triggerTop, bottom: triggerBottom, left: triggerLeft, right: triggerRight } = triggerRect;

    switch (placement) {
        case 'bottom-start':
            return { top: triggerBottom, left: triggerLeft };
        case 'bottom-end':
            return { top: triggerBottom, left: triggerRight - dropdownWidth };
        case 'top-start':
            return { top: triggerTop - dropdownHeight, left: triggerLeft };
        case 'top-end':
            return { top: triggerTop - dropdownHeight, left: triggerRight - dropdownWidth };
        case 'right-start':
            return { top: triggerTop, left: triggerRight };
        case 'right-end':
            return { top: triggerBottom - dropdownHeight, left: triggerRight };
        case 'left-start':
            return { top: triggerTop, left: triggerLeft - dropdownWidth };
        case 'left-end':
            return { top: triggerBottom - dropdownHeight, left: triggerLeft - dropdownWidth };
    }
}

function flipPlacement(placement: DropdownPlacement, triggerRect: DOMRect, dropdownWidth: number, dropdownHeight: number): DropdownPlacement {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const spaceRight = vw - triggerRect.right;
    const spaceBelow = vh - triggerRect.bottom;
    const spaceLeft = triggerRect.left;
    const spaceAbove = triggerRect.top;

    const [axis, align] = placement.split('-') as [string, string];

    let newAxis = axis;
    if (axis === 'bottom' && spaceBelow < dropdownHeight && spaceAbove > spaceBelow) newAxis = 'top';
    if (axis === 'top' && spaceAbove < dropdownHeight && spaceBelow > spaceAbove) newAxis = 'bottom';
    if (axis === 'right' && spaceRight < dropdownWidth && spaceLeft > spaceRight) newAxis = 'left';
    if (axis === 'left' && spaceLeft < dropdownWidth && spaceRight > spaceLeft) newAxis = 'right';

    return `${newAxis}-${align}` as DropdownPlacement;
}

export function Dropdown({ 
    trigger, 
    children, 
    className = '', 
    placement = 'bottom-start',
    minWidth = 150,
    triggerClassName = '',
    onOpenChange
}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const close = () => setIsOpen(false);

    const handleToggle = () => {
        setIsOpen(prev => {
            onOpenChange?.(!prev);
            return !prev;
        });
    };

    useLayoutEffect(() => {
        if (!isOpen || !triggerRef.current || !dropdownRef.current) {
            setPos(null);
            return;
        }

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const dropdownWidth = Math.max(dropdownRef.current.offsetWidth, minWidth);
        const dropdownHeight = dropdownRef.current.offsetHeight;

        const finalPlacement = flipPlacement(placement, triggerRect, dropdownWidth, dropdownHeight);
        const coords = getPlacementCoords(finalPlacement, triggerRect, dropdownWidth, dropdownHeight);

        setPos(coords);
    }, [isOpen, placement, minWidth]);

    useEffect(() => {
        if (!isOpen) return;

        const closeHandler = (e: Event) => {
            if (triggerRef.current?.contains(e.target as Node)) return;
            if (dropdownRef.current?.contains(e.target as Node)) return;
            setIsOpen(false);
            onOpenChange?.(false);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                close();
                onOpenChange?.(false);
                triggerRef.current?.focus();
            }
        };

        window.addEventListener('scroll', closeHandler, true);
        document.addEventListener('click', closeHandler);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('scroll', closeHandler, true);
            document.removeEventListener('click', closeHandler);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const dropdown = isOpen ? (
        <div
            role="menu"
            className={cn(
                'fixed z-50 flex flex-col rounded-md border border-default bg-overlay p-1.5 text-xs text-secondary shadow-dropdown',
                pos ? 'animate-dropdown-enter' : 'invisible',
                className
            )}
            style={{
                top: pos?.top ?? 0,
                left: pos?.left ?? 0,
                minWidth
            }}
            ref={dropdownRef}
        >
            <DropdownContext.Provider value={{ close }}>
                {children}
            </DropdownContext.Provider>
        </div>
    ) : null;

    return (
        <div className='relative flex items-center justify-center'>
            <div 
                ref={triggerRef}
                onClick={handleToggle}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleToggle();
                    }
                }}
                className={cn('w-full hover:cursor-pointer', triggerClassName)}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                aria-haspopup="menu"
            >
                {trigger}
            </div>
            {createPortal(dropdown, document.body)}
        </div>
    );
}

interface DropdownItemProps {
    label?: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    danger?: boolean;
    children?: React.ReactNode;
    closeOnClick?: boolean;
}

export function DropdownItem({ 
    label, 
    icon,
    onClick, 
    className = '', 
    disabled = false,
    danger = false,
    children,
    closeOnClick = true
}: DropdownItemProps) {
    const { close } = useContext(DropdownContext);

    const content = children ?? (
        <div className='flex items-center gap-2'>
            {icon && <span>{icon}</span>}
            {label && <span>{label}</span>}
        </div>
    );

    const baseClasses = disabled
        ? danger
            ? 'cursor-not-allowed text-danger/40'
            : 'cursor-not-allowed text-secondary/60'
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

interface DropdownTriggerProps {
    isOpen: boolean;
    className?: string;
}

export function DropdownTrigger({ isOpen, className = '' }: DropdownTriggerProps) {
    return (
        <div className={cn('overflow-hidden transition-all duration-150', isOpen ? 'w-5' : 'w-0', className)}>
            {isOpen ? <ChevronUpIcon size={18} /> : <ChevronDownIcon size={18} />}
        </div>
    );
}

interface DropdownDividerProps {
    className?: string;
}

export function DropdownDivider({ className = '' }: DropdownDividerProps) {
    return (
        <div className={cn('my-1 h-px bg-default', className)} />
    );
}

interface DropdownLabelProps {
    children: React.ReactNode;
    className?: string;
}

export function DropdownLabel({ children, className = '' }: DropdownLabelProps) {
    return (
        <span className={cn('block px-2 py-1.5 text-xs text-muted', className)}>
            {children}
        </span>
    );
}