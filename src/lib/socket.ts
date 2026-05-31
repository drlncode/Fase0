import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = () => socket;

export function connectSocket(session: string) {
    if (socket?.connected) return;

    socket = io(import.meta.env.VITE_WS_URL, {
        extraHeaders: {
            Authorization: `Bearer ${session}`
        }
    });
};

export const disconnectSocket = () => {
    socket?.disconnect();
    socket = null;
}

export const resetSocket = () => {
    socket?.disconnect();
    socket = null;
}
