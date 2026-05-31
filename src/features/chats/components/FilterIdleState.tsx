import { MessageIcon, MessageSearchIcon, StarIcon, MessageOffIcon } from '@/shared/components/ui/Icons';

interface FilterIdleStateProps {
    filter: 'ALL' | 'UNREAD' | 'FAVORITES' | 'SEARCH';
    searchQuery?: string;
}

const IDLE_CONFIG: Record<string, { icon: React.ReactNode; title: string; subtitle: string }> = {
    ALL: {
        icon: <MessageIcon size={28} />,
        title: 'No tienes conversaciones',
        subtitle: 'Agrega amigos o inicia un chat para empezar a chatear'
    },
    UNREAD: {
        icon: <MessageOffIcon size={28} />,
        title: 'No tienes chats sin leer',
        subtitle: 'Todos tus chats están al día'
    },
    FAVORITES: {
        icon: <StarIcon size={28} />,
        title: 'No tienes chats favoritos',
        subtitle: 'Marca chats como favoritos para encontrarlos rápido'
    },
    SEARCH: {
        icon: <MessageSearchIcon size={28} />,
        title: 'Sin resultados',
        subtitle: ''
    }
};

export function FilterIdleState({ filter, searchQuery }: FilterIdleStateProps) {
    const config = IDLE_CONFIG[filter];

    const subtitle = filter === 'SEARCH' && searchQuery
        ? `No se encontraron chats para "${searchQuery}"`
        : config.subtitle;

    return (
        <div className='flex w-full flex-col items-center gap-4 px-2 py-10 text-center'>
            <div className='flex h-14 w-14 items-center justify-center rounded-full bg-subtle'>
                {config.icon}
            </div>
            <div className='flex flex-col items-center gap-1'>
                <p className='text-sm font-medium text-primary'>{config.title}</p>
                <p className='max-w-[82%] text-xs text-secondary'>{subtitle}</p>
            </div>
        </div>
    );
}
