import { useCallback, useEffect, useRef, useState } from 'react';

interface UseCountdownReturn {
    remaining: number;
    isPending: boolean;
}

export function useCountdown(targetTimestamp: number | null): UseCountdownReturn {
    const getRemaining = useCallback(() => {
        if (!targetTimestamp) return 0;
        return Math.max(0, targetTimestamp - Date.now());
    }, [targetTimestamp]);

    const [remaining, setRemaining] = useState(getRemaining);
    const isPending = remaining > 0;
    const intervalRef = useRef<ReturnType<typeof setInterval>>(0);

    useEffect(() => {
        setRemaining(getRemaining());

        if (!isPending) return;

        intervalRef.current = setInterval(() => {
            const next = getRemaining();
            if (next === 0) {
                clearInterval(intervalRef.current);
            }
            setRemaining(next);
        }, 1000);

        return () => clearInterval(intervalRef.current);
    }, [targetTimestamp, isPending, getRemaining]);

    return { remaining, isPending };
}