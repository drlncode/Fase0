import { UserClockIcon } from '@/shared/components/ui/Icons';

export function EmptyPendingRequestsState() {
    return (
        <div className='flex w-full flex-col items-center gap-3 px-2 py-10 text-center'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-subtle'>
                <UserClockIcon size={24} />
            </div>
            <div className='flex flex-col gap-1'>
                <p className='text-sm font-medium text-primary'>Sin solicitudes pendientes</p>
                <p className='text-xs text-secondary'>Aquí aparecerán las solicitudes que te envíen</p>
            </div>
        </div>
    );
}
