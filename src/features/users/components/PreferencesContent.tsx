import { useNotificationPreferences } from '@shared/hooks/useNotificationAudio';
import { Switch } from '@shared/components/ui/Switch';

export function PreferencesContent() {
    const { enabled, toggle } = useNotificationPreferences();

    return (
        <div className='flex flex-col gap-6'>
            <div className='flex items-center justify-between gap-4'>
                <div className='flex flex-col gap-0.5'>
                    <span className='text-sm font-medium text-primary'>Sonido de notificación</span>
                    <span className='text-xs text-secondary'>
                        Reproduce un sonido al recibir un mensaje nuevo
                    </span>
                </div>
                <Switch
                    checked={enabled}
                    onChange={toggle}
                    label='Sonido de notificación'
                />
            </div>
        </div>
    );
}