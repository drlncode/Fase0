import { useEffect } from 'react';
import ModalsPortal from '@shared/components/ModalsPortal';
import { SpinLoader } from '@shared/components/ui/SpinLoader';
import { lockScroll, unlockScroll } from '@shared/utils/scrollFunctions';

export function FullScreenLoader() {
    useEffect(() => {
        lockScroll();

        return () => {
            unlockScroll();
        };
    }, []);

    return (
        <ModalsPortal>
            <div className='fixed inset-0 flex items-center justify-center bg-overlay text-secondary'>
                <SpinLoader />
            </div>
        </ModalsPortal>
    );
}
