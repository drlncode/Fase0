import { useModalStore } from '@shared/store/useModalStore';
import ModalsPortal from '@shared/components/ModalsPortal';
import { ModalsBackdrop } from '@shared/components/ModalsBackdrop';
import { ConfirmModal, BottomSheet, InfoModal } from '@shared/components/modals';

export function ModalsRenderer() {
    const modals = useModalStore(state => state.modals);

    if (modals.length === 0) return null;

    const currentModal = modals[modals.length - 1];

    const renderModal = () => {
        switch (currentModal.type) {
            case 'confirm':
                return (
                    <ConfirmModal
                        id={currentModal.id}
                        title={currentModal.props.title}
                        message={currentModal.props.message}
                        danger={currentModal.props.danger}
                        confirmText={currentModal.props.confirmText}
                        cancelText={currentModal.props.cancelText}
                        awaitedAction={currentModal.props.awaitedAction}
                        fullWidth={currentModal.props.fullWidth}
                    />
                );
            case 'bottom-sheet':
                return (
                    <BottomSheet
                        id={currentModal.id}
                        title={currentModal.props.title}
                    >
                        {currentModal.props.content}
                    </BottomSheet>
                );
            case 'info':
                return (
                    <InfoModal
                        id={currentModal.id}
                        title={currentModal.props.title}
                        content={currentModal.props.content}
                        fullWidth={currentModal.props.fullWidth}
                    />
                );
        }
    };

    return (
        <ModalsPortal>
            <ModalsBackdrop>
                {renderModal()}
            </ModalsBackdrop>
        </ModalsPortal>
    );
}
