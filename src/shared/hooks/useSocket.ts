import { useEffect, useState } from 'react';
import { connectSocket, disconnectSocket, getSocket } from '@/lib/socket';
import { useAuth } from '@auth/hooks/useAuth';

let listenerCount = 0;
let globalIsConnected = false;
const subscribers = new Set<(connected: boolean) => void>();

function notifySubscribers(connected: boolean) {
    globalIsConnected = connected;
    subscribers.forEach(fn => fn(connected));
}

export function useSocket() {
    const auth = useAuth();
    const [isConnected, setIsConnected] = useState(globalIsConnected);

    useEffect(() => {
        if (auth.status !== 'valid') return;

        const session = auth.user.session;
        let socket = getSocket();

        if (!socket) {
            connectSocket(session);
            socket = getSocket();

            if (socket) {
                socket.on('connect', () => {
                    console.info('[Socket]: Conexión establecida.');
                    notifySubscribers(true);
                });
                socket.on('disconnect', () => {
                    console.info('[Socket]: Conexión pérdida.');
                    notifySubscribers(false);
                });
                socket.on('connect_error', (error) => {
                    console.error('[Socket]: Ocurrió un error con la conexión: ', error);
                });
            }
        }

        subscribers.add(setIsConnected);
        listenerCount++;

        if (socket?.connected && !isConnected) {
            setIsConnected(true);
        }

        return () => {
            subscribers.delete(setIsConnected);
            listenerCount--;

            if (listenerCount === 0) {
                const s = getSocket();
                if (s) {
                    s.off('connect');
                    s.off('disconnect');
                    s.off('connect_error');
                }
                disconnectSocket();
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth.status, auth.status === 'valid' ? auth.user.session : undefined]);

    return {
        socket: getSocket(),
        isConnected
    };
}