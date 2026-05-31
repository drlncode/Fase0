import { updateMessage, markBatchAsRead } from '@messages/lib/messageActions';

const DEBOUNCE_MS = 1000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

interface PendingEntry {
    session: string;
    messageId: string;
}

let pendingEntries: PendingEntry[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function clearFlushTimer() {
    if (flushTimer !== null) {
        clearTimeout(flushTimer);
        flushTimer = null;
    }
}

function scheduleFlush() {
    clearFlushTimer();
    flushTimer = setTimeout(flush, DEBOUNCE_MS);
}

async function executeWithRetry(fn: () => Promise<void>, retries = 0): Promise<void> {
    try {
        await fn();
    } catch {
        if (retries < MAX_RETRIES) {
            setTimeout(() => executeWithRetry(fn, retries + 1), RETRY_DELAY_MS);
        }
    }
}

function flush() {
    flushTimer = null;
    const entries = pendingEntries.splice(0);
    if (entries.length === 0) return;

    if (entries.length === 1) {
        const { session, messageId } = entries[0];
        executeWithRetry(async () => {
            const result = await updateMessage(session, messageId, { read: true });
            if (!result.success) throw new Error('Failed to mark message as read');
        });
    } else {
        const session = entries[0].session;
        const messageIds = entries.map(e => e.messageId);
        executeWithRetry(async () => {
            const result = await markBatchAsRead(session, { messageIds });
            if (!result.success) throw new Error('Failed to batch mark messages as read');
        });
    }
}

export const readMarkerDebouncer = {
    register(session: string, messageId: string) {
        if (pendingEntries.some(e => e.messageId === messageId)) return;
        pendingEntries.push({ session, messageId });
        scheduleFlush();
    }
};