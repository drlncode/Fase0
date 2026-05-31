import { useEffect, useState } from 'react';
import { cn } from '@/shared/utils/cn';
import { CollapseableSectionItemsContainer } from '@friends/components/CollapseableSectionItemsContainer';
import { CollapseableSectionBadge } from '@friends/components/CollapseableSectionBadge';
import { SpinLoader } from '@shared/components/ui/SpinLoader';
import { ChevronRightIcon } from '@/shared/components/ui/Icons';

export interface CollapseableSectionProps {
    title: string;
    icon?: React.ReactNode;
    loading?: boolean;
    notification?: number;
    children: React.ReactNode;
    defaultOpen?: boolean;
    highlight?: boolean;
    position: 'first' | 'middle' | 'last';
    empty?: boolean;
};

export function CollapseableSection({
    title,
    icon,
    loading,
    notification,
    children,
    defaultOpen = false,
    highlight = false,
    position,
    empty = false
}: CollapseableSectionProps) {
    const [open, setOpen] = useState(defaultOpen);
    const [isHighlighting, setIsHighlighting] = useState(false);

    useEffect(() => {
        if (defaultOpen) setOpen(true);
    }, [defaultOpen]);

    useEffect(() => {
        if (highlight) {
            setIsHighlighting(true);
            const timer = setTimeout(() => setIsHighlighting(false), 1000);
            return () => clearTimeout(timer);
        } else {
            setIsHighlighting(false);
        }
    }, [highlight]);

    return (
        <section className={cn(
            'flex min-h-0 flex-col overflow-hidden border bg-overlay',
            'transition-all duration-250 ease-out',
            {
                'flex-1': open,
                'rounded-t-lg': position === 'first',
                'rounded-b-lg': position === 'last',
                'border-primary/50': isHighlighting,
                'border-default': !isHighlighting,
            }
        )}>
            {/* Header fijo */}
            <button
                onClick={() => setOpen(!open)}
                className={cn(
                    'flex items-center gap-0.5 border-b border-transparent px-1 py-1.5 text-xs font-bold uppercase transition-colors duration-150 select-none hover:cursor-pointer hover:bg-surface/60', {
                        'rounded-t-lg': position === 'first',
                        'rounded-b-lg': position === 'last' && !open,
                        'overflow-hidden border-b-default': open
                    }
                )}
            >
                <span className={cn('transition-transform', { 'rotate-90': open })}>
                    <ChevronRightIcon size={18} />
                </span>
                <span className='flex items-center justify-center gap-1.5'>
                    { icon && <span>{ icon }</span> }
                    <span>{ title }</span>
                    { !!notification && <CollapseableSectionBadge>{ notification }</CollapseableSectionBadge> }
                    { loading && <SpinLoader size={18} /> }
                </span>
            </button>

            {/* Contenido scrolleable */}
            {open && (
                <CollapseableSectionItemsContainer empty={empty}>
                    {children}
                </CollapseableSectionItemsContainer>
            )}
        </section>
    );
}
