import { useTranslation } from 'react-i18next';

export function DeletedMessageContent() {
    const { t } = useTranslation('messages');
    return (
        <span className='text-xs italic'>
            {t('deletedMessage')}
        </span>
    );
}