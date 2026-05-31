import { createPortal } from 'react-dom';

export default function ModalsPortal({ children }: { children: React.ReactNode }) {
    return createPortal(
        <div className='fixed inset-0 top-0 left-0 z-999 h-screen w-screen overflow-hidden'>
            { children }
        </div>,
        document.getElementById('modals-root')!
    );
}
