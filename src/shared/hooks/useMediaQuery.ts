import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
    const getInitial = () => {
        if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') return false;
        return window.matchMedia(query).matches;
    };

    const [matches, setMatches] = useState<boolean>(getInitial);

    useEffect(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') return;
        const mql = window.matchMedia(query);
        const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
        setMatches(mql.matches);
        mql.addEventListener('change', onChange);
        return () => mql.removeEventListener('change', onChange);
    }, [query]);

    return matches;
}

export function useIsMobile(breakpointPx = 768): boolean {
    return useMediaQuery(`(max-width: ${(breakpointPx - 1).toString()}px)`);
}
