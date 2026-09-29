export function ModalsBackdrop({ children }: { children?: React.ReactNode }) {
    return (
        <div className='absolute inset-0 overflow-y-auto bg-black/50 backdrop-blur-xs'>
            {children}
        </div>
    );
}