import { cn } from '@shared/utils/cn';
import { SubmitButton } from '@shared/components/ui/SubmitButton';

export function FriendsActionButton({
    children,
    className,
    ...props
}: React.ComponentProps<typeof SubmitButton>) {
    return (
        <SubmitButton
            className={cn('group/friend-btn w-22 border border-default bg-overlay px-1.5 py-1.75 text-xs text-primary/70 transition-all duration-200 ease-out select-none hover:bg-subtle hover:text-primary active:scale-[0.98] active:border-default disabled:pointer-events-none disabled:opacity-50', className)}
            {...props}
        >
            <span className='flex items-center justify-center gap-1.25'>
                { children }               
            </span>
        </SubmitButton>
    );
}
