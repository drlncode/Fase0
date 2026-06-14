import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ModalsPortal from '@shared/components/ModalsPortal';
import { SpinLoader } from '@shared/components/ui/SpinLoader';
import { ActivityIcon } from '@shared/components/ui/Icons';
import { lockScroll, unlockScroll } from '@shared/utils/scrollFunctions';

export function FullScreenLoader() {
    const { t } = useTranslation('app');
    const [showStatus, setShowStatus] = useState(false);

    useEffect(() => {
        lockScroll();

        const timer = setTimeout(() => {
            setShowStatus(true);
        }, 5000);

        return () => {
            clearTimeout(timer);
            unlockScroll();
        };
    }, []);

    return (
        <ModalsPortal>
            <div className='fixed inset-0 bg-overlay text-secondary'>
                <div className='flex h-full items-center justify-center'>
                    <SpinLoader />
                </div>
                {showStatus && (
                    <div className='absolute bottom-4 left-1/2 -translate-x-1/2'>
                        <a
                            href='https://stats.uptimerobot.com/LABHpngqiJ'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='group flex items-center gap-1 border-b border-transparent text-sm text-white/70 transition-all duration-200 hover:border-green-400 hover:text-white'
                        >
                            <span className='inline-block text-green-400 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-125'>
                                <ActivityIcon size={16} />
                            </span>
                            {t('loader.checkStatus')}
                        </a>
                    </div>
                )}
            </div>
        </ModalsPortal>
    );
}
