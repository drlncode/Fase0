export function CollapseableSectionItem({ children }: { children: React.ReactNode }) {
    return (
        <div className='w-full min-w-68 rounded-lg border border-default/70 p-2 transition-colors duration-250 *:transition-colors *:duration-250 hover:bg-subtle/50'>
            <div className='flex justify-between gap-3 rounded-lg'>
                { children }
            </div>
        </div>
    );
}
