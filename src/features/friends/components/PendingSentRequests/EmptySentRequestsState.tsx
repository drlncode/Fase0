import { useNavigate } from 'react-router';
import { UserShareIcon, UserPlusIcon } from '@/shared/components/ui/Icons';

export function EmptySentRequestsState() {
    const navigate = useNavigate();

    return (
        <div className='flex w-full flex-col items-center gap-3 px-2 py-10 text-center'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-subtle'>
                <UserShareIcon size={24} />
            </div>
            <div className='flex flex-col gap-1'>
                <p className='text-sm font-medium text-primary'>Sin solicitudes enviadas</p>
                <p className='text-xs text-secondary'>Envía solicitudes para conectar con otros</p>
            </div>
            <button
                type='button'
                onClick={() => navigate('/app/friends?section=add-friend')}
                className='flex items-center gap-2 rounded-md border border-default bg-overlay px-4 py-2 text-xs font-medium text-secondary transition-colors hover:cursor-pointer hover:bg-subtle'
            >
                <UserPlusIcon size={14} />
                <span>Agregar amigo</span>
            </button>
        </div>
    );
}
