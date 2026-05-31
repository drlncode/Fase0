import { useLocation, NavLink } from 'react-router';

export default function NotFoundPage() {
    const { pathname } = useLocation();

    return (
        <>
            <title>Página no encontrada | Fase0</title>
            <div>
                <h1>Esta página no existe.</h1>
                <p>La página: { pathname } no fue encontrada</p>
                <NavLink to='/' replace={ true }>Volver a Inicio</NavLink>
            </div>
        </>
    );
}
