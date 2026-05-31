import { useNavigate } from 'react-router';
import { MessageIcon, UserPlusIcon, MessagePlusIcon } from '@/shared/components/ui/Icons';

export function EmptyChatsState() {
    const navigate = useNavigate();

    return (
        <div className='flex w-full flex-col items-center gap-4 px-2 py-10 text-center'>
            <div className='flex h-14 w-14 items-center justify-center rounded-full bg-subtle'>
                <MessageIcon size={28} />
            </div>
            <div className='flex flex-col items-center gap-1'>
                <p className='text-sm font-medium text-primary'>No tienes conversaciones</p>
                <p className='max-w-[82%] text-xs text-secondary'>Agrega amigos o inicia un nuevo chat para empezar a chatear</p>
            </div>
            <div className='flex flex-col gap-1.25'>
                <button
                    type='button'
                    onClick={() => navigate('/app/friends?section=add-friend')}
                    className='flex min-w-38 items-center gap-2 rounded-md border border-default bg-overlay px-4 py-2 text-xs font-medium text-secondary transition-colors hover:cursor-pointer hover:bg-subtle'
                >
                    <UserPlusIcon size={14} />
                    <span>Agregar amigo</span>
                </button>
                <button
                    type='button'
                    onClick={() => navigate('/app/friends?section=active-friends')}
                    className='flex min-w-38 items-center gap-2 rounded-md border border-default bg-overlay px-4 py-2 text-xs font-medium text-secondary transition-colors hover:cursor-pointer hover:bg-subtle'
                >
                    <MessagePlusIcon size={14} />
                    <span>Iniciar nuevo chat</span>
                </button>
            </div>
        </div>
    );
}
