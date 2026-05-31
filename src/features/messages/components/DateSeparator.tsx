interface DateSeparatorProps {
    label: string;
}

export function DateSeparator({ label }: DateSeparatorProps) {
    return (
        <div className='sticky top-0 z-10 flex justify-center pt-2'>
            <span className='rounded-full bg-overlay/80 px-3 py-1 text-xs font-medium text-secondary shadow-sm backdrop-blur-sm'>
                {label}
            </span>
        </div>
    );
}
