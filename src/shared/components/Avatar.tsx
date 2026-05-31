import { useState, useEffect, useRef } from 'react';
import { cn } from '@/shared/utils/cn';
import { PhotoXIcon } from '@/shared/components/ui/Icons';

interface AvatarProps {
    userUrlStatus: string | null;
    externalError?: boolean;
    url?: string;
    alt: string;
    name: string;
    className?: string;
    defaultClassName?: string;
}

type AvatarStatus = 'loading' | 'loaded' | 'error';

export function Avatar({ url, userUrlStatus, externalError, alt, name, className, defaultClassName }: AvatarProps) {
    const [ status, setStatus ] = useState<AvatarStatus>('loading');
    const prevUrlRef = useRef<string>('');
    const prevUserUrlStatusRef = useRef<string | null>(null);
    const loadedUrlRef = useRef<string>('');

    useEffect(() => {
        if (!userUrlStatus) {
            setStatus('error');
            prevUserUrlStatusRef.current = null;
        } else {
            // If the avatar filename changes, we are waiting for a new URL/blob.
            // Keep it in loading instead of showing a stale error state.
            if (userUrlStatus !== prevUserUrlStatusRef.current) {
                prevUserUrlStatusRef.current = userUrlStatus;
                setStatus('loading');
            }
        }

        if (url && url !== prevUrlRef.current) {
            prevUrlRef.current = url;
            if (loadedUrlRef.current !== url) {
                setStatus('loading');
            }
        }
    }, [userUrlStatus, url]);

    const handleLoad = () => {
        loadedUrlRef.current = url ?? '';
        setStatus('loaded');
    };
    const handleError = () => setStatus('error');

    const isEmptyAvatar = !userUrlStatus;
    const showDefault = isEmptyAvatar && !!name;
    const showShimmer = status === 'loading' && !isEmptyAvatar;

    return (
        <div className={cn('relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-strong select-none', className)}>
            {showShimmer && <div className="shimmer absolute inset-0" />}

            {!isEmptyAvatar && status !== 'error' && url && (
                <img
                    src={url}
                    alt={alt}
                    onLoad={handleLoad}
                    onError={handleError}
                    loading="lazy"
                    className={cn(
                        'h-full w-full object-cover transition-opacity duration-150',
                        status === 'loaded' ? 'opacity-100' : 'opacity-0'
                    )}
                    draggable={false}
                />
            )}

            {showDefault && (
                <div className={cn('absolute inset-0 flex items-center justify-center bg-overlay text-xl text-secondary', defaultClassName)}>
                    <span>
                        {name.split('')[0].toUpperCase()}
                    </span>
                </div>
            )}

            {(!showDefault && (status === 'error' || externalError)) && (
                <div className='absolute inset-0 flex items-center justify-center bg-overlay'>
                    <span className='text-danger'>
                        <PhotoXIcon size={20} />
                    </span>
                </div>
            )}
        </div>
    );
}
