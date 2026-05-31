import { cn } from '@/shared/utils/cn';
import {
    useState, useEffect, useLayoutEffect,
    useRef, createContext, useId, type MouseEvent
} from 'react';
import { createPortal } from 'react-dom';
import { ChevronDownIcon, ChevronUpIcon, PinFilledIcon, StarFilledIcon } from '@/shared/components/ui/Icons';
import { useDropdownStore } from '@shared/store/useDropdownStore';

interface ChatOptionsDropdownContextType {
    close: () => void;
}

const ChatOptionsDropdownContext = createContext<ChatOptionsDropdownContextType>({ close: () => {} });
export { ChatOptionsDropdownContext };

interface ChatOptionsDropdownProps {
    children?: React.ReactNode;
    className?: string;
    pinned?: boolean;
    favorite?: boolean;
    unreadMessages?: number;
}

export function ChatOptionsDropdown({ children, pinned, favorite, unreadMessages = 0, className }: ChatOptionsDropdownProps) {
    const dropdownId = useId();
    const isOpen = useDropdownStore((s) => s.openId === dropdownId);
    const { open: openDropdown, close: closeDropdown } = useDropdownStore();
    const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
    const btnRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const unreadBadgeLabel = unreadMessages > 99 ? '99+' : unreadMessages;

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
        const spaceBelow = window.innerHeight - btnRect.bottom;
        const spaceAbove = btnRect.top;
        const spaceRight = vw - btnRect.right;
        const spaceLeft = btnRect.left;

        const openUpwards = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

        let left: number;
        if (spaceRight >= dropdownWidth) {
            left = btnRect.right;
        } else if (spaceLeft >= dropdownWidth) {
            left = btnRect.left - dropdownWidth;
        } else {
            left = btnRect.right;
        }

        setPos({
            top: openUpwards ? btnRect.top - dropdownHeight : btnRect.bottom,
            left,
        });
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) btnRef.current!.parentElement!.parentElement!.classList.add('open');
        else btnRef.current!.parentElement!.parentElement!.classList.remove('open');
    }, [isOpen]);

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
                left: pos?.left ?? 0,
                minWidth: 150,
            }}
            ref={dropdownRef}
        >
            <ChatOptionsDropdownContext.Provider value={{ close }}>
                {children}
            </ChatOptionsDropdownContext.Provider>
        </div>
    ) : null;

    return (
        <div className='absolute right-3 bottom-2.5 flex items-center justify-center'>
            { pinned && (
                <span className='flex items-center justify-between p-0.5 text-secondary/65'>
                    <PinFilledIcon size={16} />
                </span>
            )}
            { favorite && (
                <span className='flex items-center justify-between p-0.5 text-secondary/65'>
                    <StarFilledIcon size={16} />
                </span>
            )}
            { unreadMessages > 0 && (
                <span className='ml-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] leading-none font-semibold text-badge'>
                    {unreadBadgeLabel}
                </span>
            )}
            <button
                type="button"
                className={cn(
                    'overflow-hidden pl-0.5 transition-all duration-150 hover:cursor-pointer hover:text-primary',
                    isOpen ? 'w-5' : 'w-0 group-hover:w-5'
                )}
                onClick={handleClick}
                ref={btnRef}
                aria-expanded={isOpen}
                aria-haspopup="menu"
                aria-label="Opciones del chat"
            >
                <span className='pointer-events-none'>
                    {isOpen ? <ChevronUpIcon size={18} /> : <ChevronDownIcon size={18} />}
                </span>
            </button>

            {createPortal(dropdown, document.body)}
        </div>
    );
}