import { useTranslation } from 'react-i18next';
import type { StrengthState } from '@auth/hooks/usePasswordStrength';
import { CheckIcon } from '@/shared/components/ui/Icons';
import { cn } from '@/shared/utils/cn';

function ListItem({ condition, text }: {
    condition: boolean;
    text: string;
}) {
    return (
        <li className={cn(
            'flex items-center gap-1',
            condition ? 'text-green-400' : 'text-muted'
        )}>
            { condition && <CheckIcon size={16} /> }
            { text }
        </li>
    )
}

export function PasswordStrengthIndicator({ strength }: { strength: StrengthState }) {
    const { t } = useTranslation('auth');
    return (
        <div className='text-[13px]'>
            <ul>
                <ListItem condition={strength.hasLetter} text={t('passwordStrength.hasLetter')} />
                <ListItem condition={strength.hasNumber} text={t('passwordStrength.hasNumber')} />
                <ListItem condition={strength.hasSpecialChar} text={t('passwordStrength.hasSpecialChar')} />
                <ListItem condition={strength.minLenghth} text={t('passwordStrength.minLength')} />
                <ListItem condition={strength.maxLength} text={t('passwordStrength.maxLength')} />
            </ul>
        </div>
    )
}
