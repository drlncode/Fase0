import { NavLink } from 'react-router';
import { Fase0Logo } from '@shared/components/ui/Fase0Logo';

export function Header() {
    return (
        <header className='flex w-full shrink-0 items-center justify-start bg-overlay py-2.5 pr-3 pl-4 select-none md:px-1.5'>
            <NavLink className='w-20 shrink-0 hover:cursor-pointer' to='/app'>
                <Fase0Logo color='white' />
            </NavLink>
        </header>
    );
}
