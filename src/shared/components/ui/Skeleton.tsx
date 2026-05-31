interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div className={className}>
            <div className='shimmer h-full w-full rounded-lg' />
        </div>
    );
}
