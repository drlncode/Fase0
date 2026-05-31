import { useEffect, useId, useRef, useState } from 'react';
import { CrossIcon } from '@/shared/components/ui/Icons';
import { cn } from '@shared/utils/cn';

interface SearchBarProps {
    label?: string;
    icon?: React.ReactNode;
    prefix?: React.ReactNode;
    onSearch?: (query: string) => void;
    focus?: boolean;
}

export function SearchBar({ label, icon, prefix, onSearch, focus }: SearchBarProps) {
    const id = useId();
    const inputRef = useRef<HTMLInputElement>(null);
    const [ query, setQuery ] = useState('');

    useEffect(() => {
        if (focus) {
            inputRef.current?.focus();
        }
    }, [focus]);

    const handleChange = (value: string) => {
        setQuery(value);
        onSearch?.(value);
    };

    const handleClear = () => {
        setQuery('');
        onSearch?.('');
        inputRef.current?.focus();
    };

    return (
        <div className='w-full'>
            <label htmlFor={id} className='sr-only'>
                {label}
            </label>

            <div className='group relative flex items-center rounded-lg outline outline-default transition-[outline] duration-150 has-focus:outline-2 has-focus:outline-primary/60'>
                { icon && (
                    <div className='flex shrink-0 items-center justify-center pl-3 align-baseline text-muted transition-colors duration-150 group-focus-within:text-secondary'>
                        { icon }
                    </div>
                )}

                <div className='flex flex-1'>
                    { prefix && (
                        <div className='flex shrink-0 items-center justify-center pl-1.5 align-baseline text-muted transition-colors duration-150'>
                            { prefix }
                        </div>
                    )}
                    <input
                        ref={inputRef}
                        type="search"
                        id={id}
                        name={id}
                        value={query}
                        className={cn(
                            'w-full appearance-none rounded-lg bg-transparent p-2 pr-10 text-sm focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden',
                            { 'pl-0': prefix }
                        )}
                        placeholder={label}
                        aria-label={label}
                        autoComplete='off'
                        onChange={(e) => handleChange(e.currentTarget.value)}
                    />
                </div>

                {query && (
                    <button
                        type='button'
                        onClick={handleClear}
                        className='absolute top-0 right-0 pt-2.5 pr-2 transition-colors hover:cursor-pointer hover:text-primary focus-visible:outline-none'
                        aria-label='Limpiar busqueda'
                    >
                        <CrossIcon size={18} />
                    </button>
                )}
            </div>
        </div>
    );
}
