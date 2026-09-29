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
    empty?: boolean;
    collapsible?: boolean;
};

export function CollapseableSection({
    title,
    icon,
    loading,
    notification,
    children,
    defaultOpen = false,
    highlight = false,
    empty = false,
    collapsible = false
}: CollapseableSectionProps) {
    const [open, setOpen] = useState(defaultOpen);
    const [isHighlighting, setIsHighlighting] = useState(false);
    const isOpen = collapsible ? open : true;

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

    const headerClasses = cn(
        'flex items-center gap-1.5 border-b border-transparent px-1 py-1.5 text-xs font-bold uppercase transition-colors duration-150 select-none',
        { 'overflow-hidden border-b-default': isOpen }
    );

    const headerContent = (
        <>
            { collapsible && (
                <span className={cn('transition-transform', { 'rotate-90': isOpen })}>
                    <ChevronRightIcon size={18} />
                </span>
            )}
            <span className='flex items-center justify-center gap-1.5'>
                { icon && <span>{ icon }</span> }
                <span>{ title }</span>
                { !!notification && <CollapseableSectionBadge>{ notification }</CollapseableSectionBadge> }
                { loading && <SpinLoader size={18} /> }
            </span>
        </>
    );

    return (
        <section className={cn(
            'flex min-h-0 flex-col overflow-hidden bg-overlay',
            'transition-all duration-250 ease-out',
            {
                'flex-1': isOpen,
                'ring-1 ring-inset ring-primary/50': isHighlighting,
            }
        )}>
            {/* Header fijo */}
            { collapsible ? (
                <button
                    onClick={() => setOpen(!open)}
                    className={cn(headerClasses, 'cursor-pointer hover:bg-surface/60')}
                >
                    {headerContent}
                </button>
            ) : (
                <div className={headerClasses}>
                    {headerContent}
                </div>
            )}

            {/* Contenido scrolleable */}
            {isOpen && (
                <CollapseableSectionItemsContainer empty={empty}>
                    {children}
                </CollapseableSectionItemsContainer>
            )}
        </section>
    );
}
