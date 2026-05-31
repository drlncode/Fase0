import { cn } from '@/shared/utils/cn';

export function Form({ className, children, ...rest }: React.ComponentProps<'form'>) {
    return (
        <form
            { ...rest }
            className={cn(
                'rounded-xl border border-default bg-overlay px-5 py-6',
                className
            )}
        >
            { children }
        </form>
    );
}
