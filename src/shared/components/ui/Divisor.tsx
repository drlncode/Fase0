import { cn } from '@/shared/utils/cn';

export function Divisor({ className }: { className?: string }) {
    return (
        <div className='flex justify-center'>
            <span className={cn('my-1 w-full border-b border-b-default', className)}></span>
        </div>
    );
}
