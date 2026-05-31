import { useId, useState, useRef } from 'react';
import { cn } from '@/shared/utils/cn';
import { UseFormRegisterReturn } from "react-hook-form";
import { InfoIcon, EyeIcon, EyeOffIcon, CheckIcon, CrossIcon, LoaderIcon } from '@/shared/components/ui/Icons';

export type TextFieldStatus = 'idle' | 'checking' | 'available' | 'taken' | 'error';

interface TextFieldProps extends React.ComponentProps<"input"> {
    label: string;
    registration: UseFormRegisterReturn;
    required?: boolean;
    error?: string;
    info?: string;
    status?: TextFieldStatus;
}

export function TextField({
    label,
    registration,
    required = false,
    error,
    info,
    status = 'idle',
    className,
    type,
    ...props
}: TextFieldProps) {
    const id = useId();
    const errorId = useId();
    const infoId = useId();
    const initialType = useRef(type).current;
    const [ currentType, setType ] = useState(type);

    const handleSwitch = () => {
        setType(currentType === 'password' ? 'text' : 'password');
    }

    const describedBy = [
        error && errorId,
        info && infoId,
    ].filter(Boolean).join(' ') || undefined;

    const statusBorderClass = {
        idle: 'border-default',
        checking: 'border-default',
        available: 'border-success',
        taken: 'border-danger',
        error: 'border-danger',
    }[status];

    const inputBorderClass = error ? 'border-danger' : statusBorderClass;

    const STATUS_ICONS: Record<TextFieldStatus, React.ReactNode | null> = {
        idle: null,
        checking: <span className='animate-spin text-secondary'><LoaderIcon size={16} /></span>,
        available: <span className='text-success'><CheckIcon size={16} /></span>,
        taken: <span className='text-danger'><CrossIcon size={16} /></span>,
        error: <span className='text-danger'><CrossIcon size={16} /></span>,
    };

    return (
        <div className={cn('flex w-full flex-col gap-1', className)}>
            <label htmlFor={id} className='flex flex-col gap-0.5'>
                <span className='text-sm font-medium text-primary/80'>{ label } { required && <span className='text-red-400'>*</span> }</span>
                <div className='flex items-center gap-1.5'>
                    <input
                        id={id}
                        className={cn('flex-1 rounded-md border bg-overlay px-2.5 py-2 text-sm text-secondary transition-[border-color] duration-150 placeholder:text-muted focus:outline-none', inputBorderClass, status !== 'idle' && !error ? 'focus:border-current' : 'focus:border-primary/60')}
                        type={currentType}
                        aria-invalid={!!error}
                        aria-describedby={describedBy}
                        {...registration}
                        {...props}
                    />
                    {STATUS_ICONS[status] && (
                        <span className='shrink-0'>{STATUS_ICONS[status]}</span>
                    )}
                </div>
            </label>
            { initialType === 'password' &&
                <button 
                    type='button' 
                    onClick={handleSwitch} 
                    className='w-fit self-end hover:cursor-pointer'
                    aria-label={currentType === 'password' ? 'Mostrar contraseña' : 'Ocultar contraseña'}
                >
                    <span className='flex items-center justify-center gap-0.5 border-b border-transparent text-xs transition-all duration-150 *:transition-all *:duration-150 hover:border-b-primary/65 active:scale-[0.98]'>
                        { currentType === 'password' ? <EyeIcon size={18} /> : <EyeOffIcon size={18} /> }
                        { currentType === 'password' ? 'Mostrar' : 'Ocultar' }
                    </span>
                </button>
            }
            {info && !error &&
                <div id={infoId}>
                    <span className={cn('flex items-center gap-1 text-xs', {
                        'text-success': status === 'available',
                        'text-danger': status === 'taken' || status === 'error',
                        'text-muted': status === 'idle' || status === 'checking',
                    })}>
                        {status === 'available' && <CheckIcon size={14} />}
                        {status === 'taken' && <CrossIcon size={14} />}
                        {status === 'error' && <CrossIcon size={14} />}
                        {status === 'idle' && <InfoIcon size={18} />}
                        {status === 'checking' && <span className='animate-spin'><LoaderIcon size={14} /></span>}
                        { info }
                    </span>
                </div>
            }
            {error && <span id={errorId} className='max-w-5/6 text-sm text-red-400'>{ error }</span>}
        </div>
    );
}
