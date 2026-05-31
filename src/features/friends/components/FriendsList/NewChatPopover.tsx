import { useState, useId, useRef, useEffect } from 'react';
import { FriendsActionButton } from '@friends/components/FriendsActionButton';
import { MessagePlusIcon, ArrowUpRightIcon } from '@/shared/components/ui/Icons';

interface NewChatPopoverProps {
    onSend: (message: string) => void | Promise<void>;
    loading: boolean;
}

export function NewChatPopover({ onSend, loading }: NewChatPopoverProps) {
    const [message, setMessage] = useState('');
    const id = useId();
    const isEmpty = message.trim() === '';
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            inputRef.current?.focus();
        }, 50);

        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isEmpty && !loading) {
            onSend(message.trim());
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className='flex items-center gap-2 p-2'
        >
            <div className='group bg-background flex flex-1 items-center gap-1 rounded-lg border border-default shadow-md transition-[border-color] duration-150 focus-within:border-primary/60'>
                <div className='flex shrink-0 items-center justify-center pl-3 text-muted transition-colors duration-150 group-focus-within:text-primary'>
                    <MessagePlusIcon size={15} />
                </div>

                <div className='flex flex-1'>
                    <input
                        ref={inputRef}
                        type='text'
                        id={id}
                        name={id}
                        value={message}
                        className='w-full min-w-48 appearance-none bg-transparent py-2 pr-5 text-xs focus-visible:outline-none'
                        placeholder='Escribe un mensaje...'
                        aria-label='Escribe un mensaje'
                        autoComplete='off'
                        onChange={(e) => setMessage(e.currentTarget.value)}
                        disabled={loading}
                    />
                </div>
            </div>

            <FriendsActionButton disabled={isEmpty || loading} className='w-fit p-2 text-primary'>
                <ArrowUpRightIcon size={14} />
            </FriendsActionButton>
        </form>
    );
}