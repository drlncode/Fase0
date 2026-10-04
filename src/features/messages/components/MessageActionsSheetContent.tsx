import { Countdown } from '@shared/components/Countdown';
import { DropdownDivider } from '@/shared/components/Dropdown';
import { Avatar } from '@shared/components/Avatar';
import { useAvatarUrl } from '@shared/hooks/useAvatarUrl';
import { useModal } from '@shared/hooks/useModal';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { useChatStore } from '@chats/store/useChatStore';
import { MessageDropdownContext } from '@messages/components/MessageDropdown';
import { MessageDropdownItem } from '@messages/components/MessageDropdownItem';
import { useMessageActions, isOptimisticMessage } from '@messages/hooks/useMessageActions';
import { isDeletedMessage } from '@messages/utils/isDeletedMessage';
import { CornerDownLeftIcon, ClipboardIcon, ClipboardCheckIcon, PencilIcon, TrashIcon } from '@/shared/components/ui/Icons';

import type { StoreMessage } from '@messages/types/message.types';

const iconsSize = 20;

/**
 * Mobile BottomSheet content with the same actions as the desktop
 * `MessageDropdown`, opened via directional swipe. Touch targets are
 * larger (min 44px).
 */
export function MessageActionsSheetContent({ message }: { message: StoreMessage }) {
    const { close } = useModal();
    const {
        t,
        copied,
        updateStatus,
        isSender,
        isTimeRemainingForDelete,
        isTimeRemainingForEdit,
        handlers,
    } = useMessageActions(message, { onBeforeDialog: close });
    const isOptimisticMsg = isOptimisticMessage(message);
    const validToDelete = !isOptimisticMsg && !isDeletedMessage(message) && message.deletableUntil > Date.now();

    const { user: currentUser } = useValidAuth();
    const findChat = useChatStore(state => state.findChat);
    const isOwnMessage = currentUser._id === message.senderId;
    const peer = !isOwnMessage ? findChat(message.chatId)?.participant : undefined;
    const ownerName = isOwnMessage ? t('reply.you') : (peer?.name ?? '');
    const ownerAvatar = isOwnMessage ? currentUser.avatar : (peer?.avatar ?? null);
    const { onError: avatarError, url: avatarUrl } = useAvatarUrl(ownerAvatar, peer?._id ?? message.senderId);

    const preview = !isOptimisticMsg && isDeletedMessage(message)
        ? t('deletedMessage')
        : message.content;

    return (
        <MessageDropdownContext.Provider value={{ close }}>
            <div className='mt-9 mb-2 flex items-center gap-2.5 pl-[5px]'>
                <Avatar
                    url={avatarUrl}
                    userUrlStatus={ownerAvatar}
                    externalError={avatarError}
                    alt={ownerName}
                    name={ownerName || '?'}
                    className='h-7 w-7'
                />
                <span className='truncate text-sm font-medium text-primary'>{ownerName}</span>
            </div>
            <p className='mb-3 truncate rounded-lg bg-subtle px-3 py-2 text-sm text-secondary'>
                {preview}
            </p>
            <div className='flex flex-col gap-0.5'>
                { !isOptimisticMsg && !isDeletedMessage(message) && (
                    <>
                        <MessageDropdownItem
                            icon={<CornerDownLeftIcon size={iconsSize} />}
                            label={t('actions.reply')}
                            onClick={handlers.reply}
                            className='min-h-11 px-3 py-3 text-sm'
                        />
                        {(isTimeRemainingForEdit && isSender) && (
                            <MessageDropdownItem
                                icon={<PencilIcon size={iconsSize} />}
                                label={
                                    <span className='flex w-full flex-1 items-center justify-between gap-2.5'>
                                        <span>{t('actions.edit')}</span>
                                        {isTimeRemainingForEdit && <Countdown targetTimestamp={message.editInfo.editableUntil} className='mt-0.5 text-[10px]' />}
                                    </span>
                                }
                                onClick={handlers.edit}
                                className='min-h-11 px-3 py-3 text-sm'
                            />
                        )}
                        <DropdownDivider />
                        <MessageDropdownItem
                            icon={copied ? <ClipboardCheckIcon size={iconsSize} /> : <ClipboardIcon size={iconsSize} />}
                            label={ copied ? t('actions.copied') : t('actions.copy') }
                            closeOnClick={false}
                            onClick={handlers.copy}
                            disabled={copied}
                            className='min-h-11 px-3 py-3 text-sm'
                        />
                        <DropdownDivider />
                    </>
                )}
                {!isOptimisticMsg && (
                    <>
                        <MessageDropdownItem
                            icon={<TrashIcon size={iconsSize} />}
                            label={t('actions.deleteForMe')}
                            danger
                            onClick={handlers.deleteForMe}
                            disabled={updateStatus === 'loading'}
                            closeOnClick={false}
                            className='min-h-11 px-3 py-3 text-sm'
                        />
                        {(isSender && validToDelete && isTimeRemainingForDelete) && (
                            <MessageDropdownItem
                                icon={<TrashIcon size={iconsSize} />}
                                label={
                                    <span className='flex items-center justify-between gap-2.5'>
                                        <span>{t('actions.deleteForEveryone')}</span>
                                        {isTimeRemainingForDelete && <Countdown targetTimestamp={message.deletableUntil} className='mt-0.5 text-[10px]' />}
                                    </span>
                                }
                                danger
                                onClick={handlers.deleteForEveryone}
                                disabled={updateStatus === 'loading'}
                                closeOnClick={false}
                                className='min-h-11 px-3 py-3 text-sm'
                            />
                        )}
                    </>
                )}
            </div>
        </MessageDropdownContext.Provider>
    );
}
