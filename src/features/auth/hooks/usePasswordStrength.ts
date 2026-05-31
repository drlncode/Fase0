import { useState } from 'react';

export type StrengthState = {
    hasLetter: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
    minLenghth: boolean;
    maxLength: boolean;
}

const MAX_PASSWORD_LENGTH = 60;

export function usePasswordStrength() {
    const [ strength, setStrength ] = useState<StrengthState>({
        hasLetter: false,
        hasNumber: false,
        hasSpecialChar: false,
        minLenghth: false,
        maxLength: false
    });

    const passwordRegExp = /[^a-zA-Z0-9!@#$%^&*()+=._-]/g;

    const update = (rawValue: string) => {
        let value = rawValue.replace(passwordRegExp, '');

        if (value.length > MAX_PASSWORD_LENGTH) {
            value = value.slice(0, MAX_PASSWORD_LENGTH);
        }

        setStrength({
            hasLetter: /[a-zA-Z]/.test(value),
            hasNumber: /\d/.test(value),
            hasSpecialChar: /[!@#$%^&*()+=._-]/.test(value),
            minLenghth: value.length >= 8,
            maxLength: value.length <= MAX_PASSWORD_LENGTH
        });

        return value;
    }

    const fullStrength = Object.values(strength).every(v => v === true);

    return { strength, fullStrength, update }
}
