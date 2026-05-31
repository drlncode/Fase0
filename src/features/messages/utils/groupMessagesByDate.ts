import type { StoreMessage } from '@messages/types/message.types';

export interface MessageDateGroup {
    dateKey: string;
    label: string;
    messages: StoreMessage[];
}

function getMessageDate(message: StoreMessage): Date {
    return new Date(message.createdAt);
}

function toDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function isSameDay(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

function getStartOfWeek(date: Date): Date {
    const result = new Date(date);
    const dayOfWeek = result.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    result.setDate(result.getDate() + mondayOffset);
    result.setHours(0, 0, 0, 0);
    return result;
}

function formatShortDate(date: Date): string {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

function getDayLabel(date: Date): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const messageDay = new Date(date);
    messageDay.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (isSameDay(messageDay, today)) {
        return 'Hoy';
    }

    if (isSameDay(messageDay, yesterday)) {
        return 'Ayer';
    }

    const startOfWeek = getStartOfWeek(today);
    if (messageDay >= startOfWeek) {
        const weekday = new Intl.DateTimeFormat('es', { weekday: 'long' }).format(messageDay);
        return weekday.charAt(0).toUpperCase() + weekday.slice(1);
    }

    return formatShortDate(messageDay);
}

export function groupMessagesByDate(messages: StoreMessage[]): MessageDateGroup[] {
    const groupsMap = new Map<string, StoreMessage[]>();

    for (const message of messages) {
        const date = getMessageDate(message);
        const dateKey = toDateKey(date);

        if (!groupsMap.has(dateKey)) {
            groupsMap.set(dateKey, []);
        }

        groupsMap.get(dateKey)!.push(message);
    }

    const groups: MessageDateGroup[] = [];

    for (const [dateKey, dayMessages] of groupsMap) {
        const date = getMessageDate(dayMessages[0]);
        const label = getDayLabel(date);

        groups.push({
            dateKey,
            label,
            messages: dayMessages,
        });
    }

    groups.sort((a, b) => a.dateKey.localeCompare(b.dateKey));

    return groups;
}
