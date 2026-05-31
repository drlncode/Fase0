import { /* Link, */ Navigate } from 'react-router';

export default function LandingPage() {
    return (
        <Navigate to="/auth" replace={ true } />
        // <>
        //     <h1>Fase0 - Chatea sin límites.</h1>
        //     <Link to="/auth/signin">Iniciar sesión</Link>
        // </>
    );
}
