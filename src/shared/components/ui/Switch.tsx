import { cn } from '@shared/utils/cn';

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    label?: string;
    className?: string;
}

export function Switch({ checked, onChange, disabled = false, label, className }: SwitchProps) {
    return (
        <button
            type='button'
            role='switch'
            aria-checked={checked}
            aria-label={label}
            disabled={disabled}
            onClick={() => onChange(!checked)}
            className={cn(
                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-out',
                'focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none',
                'disabled:cursor-not-allowed disabled:opacity-50',
                checked ? 'bg-success' : 'bg-subtle',
                className
            )}
        >
            <span
                className={cn(
                    'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out',
                    checked ? 'translate-x-6' : 'translate-x-1'
                )}
            />
        </button>
    );
}