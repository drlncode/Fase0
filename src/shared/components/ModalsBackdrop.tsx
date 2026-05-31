export function ModalsBackdrop({ children }: { children?: React.ReactNode }) {
    return (
        <div className='absolute inset-0 bg-black/50 backdrop-blur-xs'>
            {children}
        </div>
    );
}