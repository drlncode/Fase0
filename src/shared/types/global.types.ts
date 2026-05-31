import { createBrowserRouter } from 'react-router';
import type { AxiosError } from 'axios';

export type Router = ReturnType<typeof createBrowserRouter>;

export type ServiceResponse<D, E = AxiosError> = 
    | { success: true, data: D }
    | { success: false, error?: E };

export type ModalType = 'confirm' | 'bottom-sheet' | 'info';

interface BaseModal {
    id: string;
}

export interface ConfirmModalProps {
    title: string;
    message: string;
    danger?: boolean;
    confirmText?: string;
    cancelText?: string;
    awaitedAction?: boolean;
    fullWidth?: boolean;
}

export interface ConfirmModal extends BaseModal {
    type: 'confirm';
    props: ConfirmModalProps;
    onConfirm: () => void | Promise<void>;
    onSuccess?: () => void;
    onDismiss?: () => void;
}

export interface BottomSheetModal extends BaseModal {
    type: 'bottom-sheet';
    props: {
        title?: string;
        content?: React.ReactNode;
    };
    onDismiss?: () => void;
}

export interface InfoModalProps {
    title?: string;
    content: React.ReactNode;
    fullWidth?: boolean;
}

export interface InfoModal extends BaseModal {
    type: 'info';
    props: InfoModalProps;
    onDismiss?: () => void;
}

export type ModalData = ConfirmModal | BottomSheetModal | InfoModal;

export interface ModalStore {
    modals: ModalData[];
    open: (modal: Omit<ModalData, 'id'>) => void;
    close: () => void;
    closeAll: () => void;
}

export type AwaitedReturn<T extends (...args: never[]) => Promise<unknown>> = Awaited<ReturnType<T>>;

export type ActionHookState<T> =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: T }
    | { status: 'error'; message: string };

export type FetchStatus =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'fetching' }
    | { status: 'success' }
    | { status: 'error'; message: string };

export interface PaginationState {
    page: number;
    limit: number;
    total: number | null;
}

export interface FetchState<S extends FetchStatus = FetchStatus> {
    status: S;
    pagination: PaginationState;
}

export interface PaginatedResponse<T> {
    page: number,
    limit: number,
    totalCount: number,
    data: T
};

export type PaginatedParams = {
    page?: number,
    limit?: number
} | undefined;

export type ToastType = 'success' | 'danger' | 'info';

export interface ToastData {
    id: string;
    type: ToastType;
    message: string;
}

export interface ToastStore {
    toasts: ToastData[];
    addToast: (toast: Omit<ToastData, 'id'>) => void;
    removeToast: (id: string) => void;
    clearAll: () => void;
}
