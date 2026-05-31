import { cn } from '@/shared/utils/cn';
import { LoaderIcon } from '@/shared/components/ui/Icons';

export function SpinLoader({ className, size }: {
    className?: string,
    size?: number
}) {
    return (
        <div className={cn('w-fit animate-spin text-inherit duration-200', className)}>
            <LoaderIcon size={size} />
        </div>
    );
}
