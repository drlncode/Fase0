import { useEffect, useRef } from 'react';
import { useFriendsStore } from '@friends/store/useFriendsStore';

export function useRefetchOnFriendsChange(refetch: () => void, isActive: boolean) {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const prevLengthsRef = useRef({
        friends: 0,
        friendsRequests: 0,
        friendsSentRequests: 0
    });

    useEffect(() => {
        if (!isActive) return;

        const unsubscribe = useFriendsStore.subscribe(
            (state) => ({
                friends: state.friends,
                friendsRequests: state.friendsRequests,
                friendsSentRequests: state.friendsSentRequests
            }),
            (current) => {
                const prev = prevLengthsRef.current;
                const friendsChanged = prev.friends !== current.friends.length;
                const requestsChanged = prev.friendsRequests !== current.friendsRequests.length;
                const sentChanged = prev.friendsSentRequests !== current.friendsSentRequests.length;

                if (friendsChanged || requestsChanged || sentChanged) {
                    prevLengthsRef.current = {
                        friends: current.friends.length,
                        friendsRequests: current.friendsRequests.length,
                        friendsSentRequests: current.friendsSentRequests.length
                    };

                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }

                    timeoutRef.current = setTimeout(() => {
                        refetch();
                    }, 100);
                }
            }
        );

        return () => {
            unsubscribe();
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [isActive, refetch]);
}