import { cn } from '@/shared/utils/cn';

interface CollapseableSectionItemsContainerProps {
    children: React.ReactNode;
    empty?: boolean;
}

export function CollapseableSectionItemsContainer({ children, empty = false }: CollapseableSectionItemsContainerProps) {
    return (
        <div className={cn(
            'grid flex-1 grid-cols-[repeat(auto-fill,minmax(272px,1fr))] content-start items-start gap-2.5 overflow-y-auto bg-surface p-2.5',
            { 'flex flex-col items-center justify-center': empty }
        )}>
            {children}
        </div>
    );
}
