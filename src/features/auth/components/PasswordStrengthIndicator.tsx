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
    return (
        <div className='text-[13px]'>
            <ul>
                <ListItem condition={strength.hasLetter} text='Al menos una letra' />
                <ListItem condition={strength.hasNumber} text='Al menos un número' />
                <ListItem condition={strength.hasSpecialChar} text='Al menos un carácter especial (!@#$%^&*()+=._-)' />
                <ListItem condition={strength.minLenghth} text='Al menos 8 caracteres' />
                <ListItem condition={strength.maxLength} text='Máximo 60 caracteres' />
            </ul>
        </div>
    )
}
