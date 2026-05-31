import { cn } from '@/shared/utils/cn';

export function SubmitButton({ className, children, ...rest }: Omit<React.ComponentProps<'button'>, 'type'>) {
    return (
        <button type='submit' className={cn('flex w-full items-center justify-center gap-1.5 rounded-md border border-default p-2 text-[14px] text-primary transition-all duration-200 ease-out hover:cursor-pointer hover:border-default/75 hover:bg-surface active:scale-[0.98] active:border-default disabled:cursor-not-allowed disabled:text-primary/70', className)} { ...rest }>
            { children }
        </button>
    );
}
