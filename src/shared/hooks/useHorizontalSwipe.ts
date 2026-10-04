import { useCallback, useRef, useState } from 'react';

export type HorizontalSwipeDirection = 'left' | 'right';

interface UseHorizontalSwipeOptions {
    /** Allowed swipe directions. E.g. chats: ['left']; sent messages: ['left']; received: ['right']. */
    allowed: HorizontalSwipeDirection[];
    /** Horizontal travel (px) needed to trigger. Defaults to 56. */
    threshold?: number;
    /** Vertical travel (px) that cancels the gesture so vertical scroll wins. Defaults to 36. */
    verticalTolerance?: number;
    /** Max visual drag offset (px). Defaults to 72. */
    maxOffset?: number;
    /** When true the gesture is ignored (e.g. non-touch devices). */
    disabled?: boolean;
    onSwipe: (direction: HorizontalSwipeDirection) => void;
}

interface HorizontalSwipeHandlers {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
    onTouchCancel: () => void;
    /** Attach in capture phase on the swipeable container to swallow the click/NavLink after a swipe. */
    onClickCapture: (e: React.MouseEvent) => void;
}

function vibrate(): void {
    try {
        navigator?.vibrate?.(12);
    } catch { /* noop: haptics are best-effort */ }
}

/**
 * Touch-only horizontal swipe detector.
 *
 * Designed to coexist with vertical scroll (`touch-action: pan-y` on the container):
 * as soon as vertical movement dominates, the gesture is cancelled and the
 * browser owns the scroll. Multi-touch is ignored.
 */
export function useHorizontalSwipe({
    allowed,
    threshold = 56,
    verticalTolerance = 36,
    maxOffset = 72,
    disabled = false,
    onSwipe,
}: UseHorizontalSwipeOptions): {
    handlers: HorizontalSwipeHandlers;
    /** Current drag offset in px (clamped). Bind to `transform: translateX()`. */
    offsetX: number;
    /** True while the finger is dragging horizontally. Disable transitions while true. */
    isSwiping: boolean;
} {
    const [offsetX, setOffsetX] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const startRef = useRef<{ x: number; y: number } | null>(null);
    const trackingRef = useRef(false);
    const suppressClickUntilRef = useRef(0);
    const onSwipeRef = useRef(onSwipe);
    onSwipeRef.current = onSwipe;

    const reset = useCallback(() => {
        startRef.current = null;
        trackingRef.current = false;
        setIsSwiping(false);
        setOffsetX(0);
    }, []);

    const onTouchStart = useCallback((e: React.TouchEvent) => {
        if (disabled || e.touches.length > 1) {
            trackingRef.current = false;
            return;
        }
        const touch = e.touches[0];
        startRef.current = { x: touch.clientX, y: touch.clientY };
        trackingRef.current = true;
    }, [disabled]);

    const onTouchMove = useCallback((e: React.TouchEvent) => {
        if (disabled || !trackingRef.current || !startRef.current || e.touches.length > 1) return;
        const touch = e.touches[0];
        const dx = touch.clientX - startRef.current.x;
        const dy = touch.clientY - startRef.current.y;

        // Vertical scroll wins: cancel so the list/messages keep scrolling natively.
        if (Math.abs(dy) > verticalTolerance && Math.abs(dy) > Math.abs(dx)) {
            reset();
            return;
        }

        let offset = 0;
        if (dx < 0 && allowed.includes('left')) {
            offset = Math.max(dx, -maxOffset);
        } else if (dx > 0 && allowed.includes('right')) {
            offset = Math.min(dx, maxOffset);
        }

        setIsSwiping(true);
        setOffsetX(offset);
    }, [allowed, disabled, maxOffset, reset, verticalTolerance]);

    const onTouchEnd = useCallback((e: React.TouchEvent) => {
        if (disabled || !trackingRef.current || !startRef.current) {
            reset();
            return;
        }
        const touch = e.changedTouches[0];
        const dx = touch.clientX - startRef.current.x;
        const dy = touch.clientY - startRef.current.y;
        const direction: HorizontalSwipeDirection | null =
            dx < 0 && allowed.includes('left') ? 'left'
            : dx > 0 && allowed.includes('right') ? 'right'
            : null;

        reset();

        if (direction && Math.abs(dx) >= threshold && Math.abs(dy) <= verticalTolerance) {
            // Swallow the click that the browser may synthesize after the swipe
            // (prevents e.g. NavLink navigation when swiping a chat row).
            suppressClickUntilRef.current = Date.now() + 600;
            vibrate();
            onSwipeRef.current(direction);
        }
    }, [allowed, disabled, reset, threshold, verticalTolerance]);

    const onTouchCancel = useCallback(() => {
        reset();
    }, [reset]);

    const onClickCapture = useCallback((e: React.MouseEvent) => {
        if (Date.now() < suppressClickUntilRef.current) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, []);

    return {
        handlers: { onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, onClickCapture },
        offsetX,
        isSwiping,
    };
}
