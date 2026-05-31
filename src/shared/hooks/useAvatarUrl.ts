import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { useAvatarCacheStore } from '@shared/store/useAvatarCacheStore';

export function useAvatarUrl(avatar: string | null, userId: string) {
    const [ onError, setOnError ] = useState(false);
    const [ objectUrl, setObjectUrl ] = useState<string>('');
    
    const getAvatar = useAvatarCacheStore(state => state.getAvatar);
    const setAvatar = useAvatarCacheStore(state => state.setAvatar);
    const { user: { session } } = useValidAuth();

    useEffect(() => {
        // Reset when switching avatars (or clearing it) to avoid showing stale/revoked URLs.
        setOnError(false);

        if (!avatar) {
            setObjectUrl('');
            return;
        }

        let cancelled = false;

        async function fetchImage() {
            try {
                const { data } = await api.get<Blob>(`/media/avatars/${avatar}`, {
                    responseType: 'blob',
                    headers: {
                        Authorization: `Bearer ${session}`
                    }
                });

                if (cancelled) return;

                const oUrl = URL.createObjectURL(data);
                setObjectUrl(oUrl);
                setAvatar(userId, avatar!, data, oUrl);
            } catch {
                if (!cancelled) {
                    setObjectUrl('');
                    setOnError(true);
                }
            }
        }

        const cached = getAvatar(userId, avatar);
        if (cached) {
            setObjectUrl(cached);
            return;
        }

        // Avoid rendering a stale/revoked previous URL while we fetch the new one.
        setObjectUrl('');
        fetchImage();
        return () => { cancelled = true; };
    }, [avatar, session, userId, getAvatar, setAvatar]);

    return { onError, url: objectUrl };
}
