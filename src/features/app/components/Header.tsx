import { NavLink } from 'react-router';
import { Fase0Logo } from '@shared/components/ui/Fase0Logo';

export function Header() {
    return (
        <header className='flex w-full justify-start bg-overlay px-1.5 py-1.5 select-none'>
            <NavLink className='w-20 pb-1 hover:cursor-pointer' to='/app'>
                <Fase0Logo color='white' />
            </NavLink>
        </header>
    );
}
