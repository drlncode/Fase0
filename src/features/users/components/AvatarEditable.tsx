import { useRef } from 'react';
import { useAvatarUrl } from '@shared/hooks/useAvatarUrl';
import { Dropdown, DropdownItem, DropdownDivider } from '@shared/components/Dropdown';
import { PencilIcon, TrashIcon, PhotoXIcon, UserPlusIcon } from '@/shared/components/ui/Icons';
import { cn } from '@shared/utils/cn';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarEditableProps {
    userId: string;
    name: string;
    avatar: string | null;
    previewUrl?: string | null;
    pendingDeletion?: boolean;
    isLoading?: boolean;
    onSelectAvatar: (file: File) => void;
    onRemoveAvatar: () => void;
    className?: string;
    size?: AvatarSize;
}

const SIZE_CLASSES: Record<AvatarSize, string> = {
    sm: 'h-10 w-10',
    md: 'h-20 w-20',
    lg: 'h-24 w-24',
    xl: 'h-30 w-30',
};

export function AvatarEditable({
    userId,
    name,
    avatar,
    previewUrl = null,
    pendingDeletion = false,
    isLoading = false,
    onSelectAvatar,
    onRemoveAvatar,
    className,
    size = 'md'
}: AvatarEditableProps) {
    const effectiveAvatar = pendingDeletion ? null : avatar;
    const { url, onError } = useAvatarUrl(effectiveAvatar, userId);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const remoteUrl = effectiveAvatar ? url : '';
    const imageUrl = previewUrl || remoteUrl;
    const hasAvatar = Boolean(previewUrl || effectiveAvatar);
    const isEmptyAvatar = !hasAvatar;
    const showDefault = isEmptyAvatar && !!name;
    const hasImageError = !previewUrl && !!effectiveAvatar && onError;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        onSelectAvatar(file);
        e.target.value = '';
    };

    const openFilePicker = () => {
        setTimeout(() => {
            fileInputRef.current?.click();
        }, 0);
    };

    return (
        <div className={cn('relative flex flex-col items-center gap-3', className)}>
            <Dropdown
                trigger={
                    <div className={cn('group relative shrink-0 cursor-pointer overflow-hidden rounded-full border-2 border-strong select-none', SIZE_CLASSES[size], isLoading && 'pointer-events-none opacity-70')}>
                        {imageUrl && !hasImageError && (
                            <img
                                src={imageUrl}
                                alt={`Avatar de ${name}`}
                                className='h-full w-full object-cover'
                                draggable={false}
                            />
                        )}

                        {showDefault && (
                            <div className='absolute inset-0 flex items-center justify-center bg-overlay text-2xl text-secondary'>
                                <span>{name.split('')[0].toUpperCase()}</span>
                            </div>
                        )}

                        {(!showDefault && (hasImageError || (!imageUrl && !isEmptyAvatar))) && (
                            <div className='absolute inset-0 flex items-center justify-center bg-overlay'>
                                <span className='text-danger'>
                                    <PhotoXIcon size={24} />
                                </span>
                            </div>
                        )}

                        <div className='absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-150 group-hover:opacity-100'>
                            <span className='text-white'>
                                <PencilIcon size={size === 'xl' || size === 'lg' ? 24 : 20} />
                            </span>
                        </div>
                    </div>
                }
                placement='bottom-start'
                className='z-[1100]'
            >
                <DropdownItem
                    label={hasAvatar ? 'Cambiar foto' : 'Subir foto'}
                    icon={hasAvatar ? <PencilIcon size={14} /> : <UserPlusIcon size={14} />}
                    onClick={openFilePicker}
                    disabled={isLoading}
                />
                {hasAvatar && (
                    <>
                        <DropdownDivider />
                        <DropdownItem
                            label='Eliminar foto'
                            icon={<TrashIcon size={14} />}
                            danger
                            onClick={onRemoveAvatar}
                            disabled={isLoading}
                        />
                    </>
                )}
            </Dropdown>

            <input
                ref={fileInputRef}
                type='file'
                accept='image/jpeg,image/jpg,image/png'
                className='hidden'
                onChange={handleFileChange}
            />
        </div>
    );
}
