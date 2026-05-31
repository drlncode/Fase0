import '@github/relative-time-element';

import { cn } from '@/shared/utils/cn';

export function ChatTime({ timestamp, className }: { timestamp: number; className?: string }) {
    const date = new Date(timestamp);
    const datetime = date.toISOString();
    const now = new Date();
    const day = now.getDay();
    const startOfWeek = new Date(now);
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const isToday = date.toDateString() === now.toDateString();
    startOfWeek.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
    startOfWeek.setHours(0, 0, 0, 0);

    // Semana diferente a la actual -> 3/3/2026
    if (date < startOfWeek) {
        const formatted = new Intl.DateTimeFormat('es', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
        }).format(date);

        return <span className={className}>{formatted}</span>;
    }

    // Mismo día pero hace más de 1 hora -> solo la hora: "7:36 a. m. / p. m."
    if (isToday && diffHours > 1) {
        const formatted = new Intl.DateTimeFormat('es', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(date);

        return <span className={className}>{formatted}</span>;
    }

    // Menos de 1 hora o día distinto pero menos de 7 días-> relativo
    return (
        <relative-time className={cn(className)} datetime={datetime} lang="es" prefix="" format="relative" />
    );
}
