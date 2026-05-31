import { useCountdown } from '@/shared/hooks/useCountdown';

interface CountdownProps {
    targetTimestamp: number;
    className?: string;
}

function formatRemaining(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => String(n).padStart(2, '0');

    if (hours > 0) {
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }

    return `${pad(minutes)}:${pad(seconds)}`;
}

export function Countdown({ targetTimestamp, className }: CountdownProps) {
    const { remaining, isPending } = useCountdown(targetTimestamp);

    if (!isPending) return null;

    return <span className={className}>{formatRemaining(remaining)}</span>;
}