import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { useUpdateUser } from '@users/hooks/useUpdateUser';
import { useGetUsernameAvailability } from '@users/hooks/useGetUsernameAvailability';
import { useUploadAvatar } from '@media/hooks/useUploadAvatar';
import { useDeleteAvatar } from '@media/hooks/useDeleteAvatar';
import { AvatarEditable } from '@users/components/AvatarEditable';
import { TextField, type TextFieldStatus } from '@shared/components/TextField';
import { SubmitButton } from '@shared/components/ui/SubmitButton';
import { SpinLoader } from '@shared/components/ui/SpinLoader';

import type { UpdateUserBody } from '@users/types/user.types';

type AccountFormValues = {
    name: string;
    username: string;
}
const USERNAME_ALLOWED_REGEX = /[^a-zA-Z0-9._-]/g;

export function AccountContent() {
    const { t } = useTranslation('users');
    const { user } = useValidAuth();
    const { status: updateStatus, update } = useUpdateUser();
    const { status: uploadStatus, upload } = useUploadAvatar();
    const { status: deleteStatus, remove } = useDeleteAvatar();
    const { checkUsernameAvailability } = useGetUsernameAvailability();
    const [error, setError] = useState<string | null>(null);
    const [usernameStatus, setUsernameStatus] = useState<TextFieldStatus>('idle');
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
    const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
    const [pendingAvatarDeletion, setPendingAvatarDeletion] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const usernameCheckSeqRef = useRef(0);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isDirty, dirtyFields }
    } = useForm<AccountFormValues>({
        mode: 'onSubmit',
        defaultValues: {
            name: user.name,
            username: user.username,
        }
    });

    const usernameValue = watch('username', user.username);
    const hasUsernameChanged = Boolean(dirtyFields.username);
    const usernameError = errors.username?.message;

    const checkUsername = useCallback(async (username: string) => {
        const seq = ++usernameCheckSeqRef.current;
        const result = await checkUsernameAvailability(username);
        if (seq !== usernameCheckSeqRef.current) return;
        if (!result) {
            setUsernameStatus('error');
            return;
        }
        setUsernameStatus(result.isAvailable ? 'available' : 'taken');
    }, [checkUsernameAvailability]);
    const clearDebounce = () => {
        usernameCheckSeqRef.current += 1; // invalidate any in-flight checks
        if (!debounceRef.current) return;
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
    };

    useEffect(() => {
        clearDebounce();

        if (!hasUsernameChanged || usernameError) {
            usernameCheckSeqRef.current += 1;
            setUsernameStatus('idle');
            return;
        }

        if (usernameValue.length < 4) {
            usernameCheckSeqRef.current += 1;
            setUsernameStatus('idle');
            return;
        }

        // Hide status while the user is typing; debounce will switch to "checking".
        setUsernameStatus('idle');
        debounceRef.current = setTimeout(() => {
            setUsernameStatus('checking');
            checkUsername(usernameValue);
        }, 500);

        return () => {
            clearDebounce();
        };
    }, [usernameValue, hasUsernameChanged, usernameError, checkUsername]);

    useEffect(() => {
        return () => {
            if (avatarPreviewUrl) {
                URL.revokeObjectURL(avatarPreviewUrl);
            }
        };
    }, [avatarPreviewUrl]);

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitizedValue = e.target.value.replace(USERNAME_ALLOWED_REGEX, '').toLowerCase();

        setValue('username', sanitizedValue, {
            shouldValidate: true,
            shouldDirty: true
        });

        if (sanitizedValue.length < 4) {
            clearDebounce();
            setUsernameStatus('idle');
        }
    };

    const handleAvatarSelect = (file: File) => {
        setError(null);
        setPendingAvatarDeletion(false);
        setPendingAvatarFile(file);
        setAvatarPreviewUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return URL.createObjectURL(file);
        });
    };

    const handleAvatarRemove = () => {
        setError(null);
        setPendingAvatarFile(null);
        setAvatarPreviewUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
        });

        setPendingAvatarDeletion(Boolean(user.avatar));
    };

    const usernameInfo = (() => {
        if (!hasUsernameChanged || usernameValue.length < 4 || usernameError) return undefined;
        if (usernameStatus === 'checking') return t('username.checking');
        if (usernameStatus === 'available') return t('username.available');
        if (usernameStatus === 'taken') return t('username.taken');
        if (usernameStatus === 'error') return t('username.checkError');
        return undefined;
    })();

    const isLoading = updateStatus.status === 'loading' || uploadStatus.status === 'loading' || deleteStatus.status === 'loading';
    const hasAvatarChanges = Boolean(pendingAvatarFile) || pendingAvatarDeletion;
    const isSubmitDisabled = (!isDirty && !hasAvatarChanges) || isLoading || usernameStatus === 'checking' || (hasUsernameChanged && usernameStatus === 'taken');

    const onSubmit = async (data: AccountFormValues) => {
        setError(null);

        let updatedProfile: { name: string; username: string } | null = null;

        if (dirtyFields.username && usernameStatus !== 'available') {
            setUsernameStatus('checking');
            const result = await checkUsernameAvailability(data.username);
            if (!result) {
                setUsernameStatus('error');
                setError(t('errors.verifyAvailability'));
                return;
            }
            if (!result.isAvailable) {
                setUsernameStatus('taken');
                setError(t('errors.usernameTaken'));
                return;
            }
            setUsernameStatus('available');
        }

        const body: UpdateUserBody = {};
        if (dirtyFields.name) body.name = data.name;
        if (dirtyFields.username) body.username = data.username;
        if (Object.keys(body).length > 0) {
            const userUpdated = await update(body);
            if (!userUpdated) {
                setError(t('errors.updateProfile'));
                return;
            }

            updatedProfile = { name: userUpdated.name, username: userUpdated.username };
        }

        if (pendingAvatarDeletion) {
            const avatarDeleted = await remove();
            if (!avatarDeleted) {
                setError(t('errors.deleteAvatar'));
                return;
            }

            setPendingAvatarDeletion(false);
        }

        if (pendingAvatarFile) {
            const avatarUploaded = await upload(pendingAvatarFile);
            if (!avatarUploaded) {
                setError(t('errors.updateAvatar'));
                return;
            }

            setPendingAvatarFile(null);
            setAvatarPreviewUrl((prev) => {
                if (prev) URL.revokeObjectURL(prev);
                return null;
            });
        }

        // After a successful submit, align RHF defaults with the server-confirmed values.
        const nextName = updatedProfile?.name ?? user.name;
        const nextUsername = updatedProfile?.username ?? user.username;
        reset({ name: nextName, username: nextUsername });
        clearDebounce();
        setUsernameStatus('idle');
    };

    return (
        <div className='flex flex-col items-center gap-5'>
            <AvatarEditable
                userId={user._id}
                name={user.name}
                avatar={user.avatar}
                previewUrl={avatarPreviewUrl}
                pendingDeletion={pendingAvatarDeletion}
                isLoading={isLoading}
                onSelectAvatar={handleAvatarSelect}
                onRemoveAvatar={handleAvatarRemove}
                size='xl'
            />

            <div className='flex flex-col items-center gap-0.5'>
                <p className='font-semibold text-primary'>{user.name}</p>
                <p className='text-sm text-secondary'>@{user.username}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className='flex w-full flex-col gap-4 border-t border-default pt-5'>
                <TextField
                    label={t('form.nameLabel')}
                    placeholder={t('form.namePlaceholder')}
                    type='text'
                    registration={register('name', {
                        minLength: {
                            value: 3,
                            message: t('form.nameMinLength')
                        },
                        maxLength: {
                            value: 50,
                            message: t('form.nameMaxLength')
                        }
                    })}
                    error={errors.name?.message}
                />

                <TextField
                    label={t('form.usernameLabel')}
                    placeholder={t('form.usernamePlaceholder')}
                    type='text'
                    registration={register('username', {
                        minLength: {
                            value: 4,
                            message: t('form.usernameMinLength')
                        },
                        maxLength: {
                            value: 20,
                            message: t('form.usernameMaxLength')
                        },
                        pattern: {
                            value: /^[a-z0-9._-]+$/,
                            message: t('form.usernamePattern')
                        },
                        onChange: handleUsernameChange
                    })}
                    error={errors.username?.message}
                    status={usernameStatus}
                    info={usernameInfo}
                />

                {error && (
                    <span className='text-sm text-danger'>{error}</span>
                )}

                <SubmitButton
                    disabled={isSubmitDisabled}
                    className='mt-1 border border-default bg-overlay font-medium text-primary hover:bg-subtle active:scale-[0.98]'
                >
                    {isLoading ? <SpinLoader size={18} /> : t('actions.saveChanges')}
                </SubmitButton>
            </form>
        </div>
    );
}
