import { useNavigate } from 'react-router';
import { useFriendsStore } from '@friends/store/useFriendsStore';
import { Fase0Logo } from '@shared/components/ui/Fase0Logo';
import {
    UsersIcon,
    UserClockIcon,
    UserPlusIcon,
} from '@/shared/components/ui/Icons';

export default function AppPage() {
    const navigate = useNavigate();
    const numberOfFriends = useFriendsStore(state => state.friends.length);
    const numberOfPendingRequests = useFriendsStore(state => state.friendsRequests.length);
    const title = 'Chats | Fase0';

    return (
        <>
            <title>{title}</title>
            <section className='animate-page-enter flex h-full w-full flex-col items-center justify-center gap-6 px-4'>
                <div className='flex flex-col items-center gap-2 text-center'>
                    <Fase0Logo color='white' className='w-30' />
                    <h2 className='text-2xl font-semibold text-primary'>Bienvenido a Fase0</h2>
                    <p className='max-w-sm text-sm text-secondary'>
                        Selecciona un chat de la lista o explora las siguientes opciones para comenzar.
                    </p>
                </div>

                <div className='flex w-full max-w-md flex-col gap-3'>
                    <button
                        type='button'
                        onClick={() => navigate('/app/friends?section=active-friends')}
                        className='relative flex items-center gap-3 rounded-lg border border-default bg-overlay px-4 py-3 text-sm text-secondary transition-colors hover:cursor-pointer hover:bg-surface'
                    >
                        <UsersIcon size={20} />
                        <span>Ver amigos</span>
                        {numberOfFriends > 0 && (
                            <span className='absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-overlay'>
                                {numberOfFriends}
                            </span>
                        )}
                    </button>

                    <button
                        type='button'
                        onClick={() => navigate('/app/friends?section=pending-requests')}
                        className='relative flex items-center gap-3 rounded-lg border border-default bg-overlay px-4 py-3 text-sm text-secondary transition-colors hover:cursor-pointer hover:bg-surface'
                    >
                        <UserClockIcon size={20} />
                        <span>Solicitudes pendientes</span>
                        {numberOfPendingRequests > 0 && (
                            <span className='absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-overlay'>
                                {numberOfPendingRequests}
                            </span>
                        )}
                    </button>

                    <button
                        type='button'
                        onClick={() => navigate('/app/friends?section=add-friend')}
                        className='relative flex items-center gap-3 rounded-lg border border-default bg-overlay px-4 py-3 text-sm text-secondary transition-colors hover:cursor-pointer hover:bg-surface'
                    >
                        <UserPlusIcon size={20} />
                        <span>Agregar amigo</span>
                    </button>
                </div>
            </section>
        </>
    );
}
