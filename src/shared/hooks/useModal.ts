import { useModalStore } from '@shared/store/useModalStore';
import type { ConfirmModalProps, ConfirmModal, BottomSheetModal, InfoModalProps, InfoModal } from '@shared/types/global.types';

type OpenConfirmParams = ConfirmModalProps & {
    onConfirm: () => void | Promise<void>;
    onSuccess?: () => void;
    onDismiss?: () => void;
};

type OpenBottomSheetParams = {
    title?: string;
    content?: React.ReactNode;
    onDismiss?: () => void;
};

type OpenInfoParams = InfoModalProps & {
    onDismiss?: () => void;
};

export function useModal() {
    const open = useModalStore(state => state.open);
    const close = useModalStore(state => state.close);
    const closeAll = useModalStore(state => state.closeAll);

    const openConfirm = (params: OpenConfirmParams) => {
        const { onConfirm, onSuccess, onDismiss, ...props } = params;
        open({
            type: 'confirm',
            props: props,
            onConfirm,
            onSuccess,
            onDismiss
        } as ConfirmModal);
    };

    const openBottomSheet = (params: OpenBottomSheetParams) => {
        open({
            type: 'bottom-sheet',
            props: {
                title: params.title,
                content: params.content
            },
            onDismiss: params.onDismiss
        } as BottomSheetModal);
    };

    const openInfo = (params: OpenInfoParams) => {
        const { onDismiss, ...props } = params;
        open({
            type: 'info',
            props: props,
            onDismiss
        } as InfoModal);
    };

    return {
        openConfirm,
        openBottomSheet,
        openInfo,
        close,
        closeAll
    };
}