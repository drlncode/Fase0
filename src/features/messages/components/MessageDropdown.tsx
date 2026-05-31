import { cn } from '@/shared/utils/cn';
import {
    useState, useEffect, useLayoutEffect,
    useRef, createContext, useId, type MouseEvent
} from 'react';
import { createPortal } from 'react-dom';
import { ChevronDownIcon, ChevronUpIcon } from '@/shared/components/ui/Icons';
import { useDropdownStore } from '@shared/store/useDropdownStore';

interface MessageDropdownContextType {
    close: () => void;
}

const MessageDropdownContext = createContext<MessageDropdownContextType>({ close: () => {} });
export { MessageDropdownContext };

interface MessageDropdownProps {
    children?: React.ReactNode;
    className?: string;
    side?: 'sent' | 'received';
}

export function MessageDropdown({ children, side = 'sent', className }: MessageDropdownProps) {
    const dropdownId = useId();
    const isOpen = useDropdownStore((s) => s.openId === dropdownId);
    const { open: openDropdown, close: closeDropdown } = useDropdownStore();
    const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
    const btnRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleClick = (e: MouseEvent) => {
        e.stopPropagation();
        if (isOpen) {
            closeDropdown();
        } else {
            openDropdown(dropdownId);
        }
    };

    const close = () => closeDropdown();

    useLayoutEffect(() => {
        if (!isOpen || !btnRef.current || !dropdownRef.current) {
            setPos(null);
            return;
        }

        const btnRect = btnRef.current.getBoundingClientRect();
        const dropdownHeight = dropdownRef.current.offsetHeight;
        const dropdownWidth = dropdownRef.current.offsetWidth;
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const spaceBelow = vh - btnRect.bottom;
        const spaceAbove = btnRect.top;
        const spaceRight = vw - btnRect.right;
        const spaceLeft = btnRect.left;

        let top: number;
        let left: number;

        if (side === 'received') {
            const openUpwards = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
            top = openUpwards ? btnRect.top - dropdownHeight : btnRect.bottom;

            left = spaceRight >= dropdownWidth
                ? btnRect.right
                : spaceLeft >= dropdownWidth
                    ? btnRect.left - dropdownWidth
                    : btnRect.right;
        } else {
            const openUpwards = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
            top = openUpwards ? btnRect.top - dropdownHeight : btnRect.bottom;

            left = spaceRight >= dropdownWidth
                ? btnRect.right
                : btnRect.left - dropdownWidth;
        }

        setPos({ top, left });
    }, [isOpen, side]);

    useEffect(() => {
        if (!isOpen) return;

        const closeHandler = (e: Event) => {
            if (btnRef.current?.contains(e.target as Node)) return;
            if (dropdownRef.current?.contains(e.target as Node)) return;
            closeDropdown();
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeDropdown();
                btnRef.current?.focus();
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
                'fixed z-50 flex shrink-0 flex-col rounded-md border border-default bg-overlay p-1.5 text-xs text-secondary shadow-dropdown',
                pos ? 'animate-dropdown-enter' : 'invisible',
                className
            )}
            style={{
                top: pos?.top ?? 0,
                left: pos?.left ?? 0
            }}
            ref={dropdownRef}
        >
            <MessageDropdownContext.Provider value={{ close }}>
                {children}
            </MessageDropdownContext.Provider>
        </div>
    ) : null;

    return (
        <div className={cn(
            'absolute top-0 right-0 flex h-7.5 items-center opacity-0 transition-opacity duration-150 group-hover/message:opacity-100',
            isOpen && 'opacity-100'
        )}>
            <div className={cn('pointer-events-none absolute inset-y-0 right-0 w-6 rounded-full bg-linear-to-r', {
                'from-subtle to-subtle/60': side === 'sent',
                'from-overlay to-overlay/60': side === 'received'
            })} />
            <button
                type="button"
                className='relative z-10 overflow-hidden pr-1 transition-all duration-150 hover:cursor-pointer hover:text-primary'
                onClick={handleClick}
                ref={btnRef}
                aria-expanded={isOpen}
                aria-haspopup="menu"
                aria-label="Opciones del mensaje"
            >
                <span className='pointer-events-none'>
                    {isOpen ? <ChevronUpIcon size={18} /> : <ChevronDownIcon size={18} />}
                </span>
            </button>

            {createPortal(dropdown, document.body)}
        </div>
    );
}