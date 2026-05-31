import { useRef } from 'react';
import isEqual from 'fast-deep-equal';

export function useDeepMemo<T>(value: T): T {
    const currentValue = useRef<T>(value);

    if (!isEqual(currentValue.current, value)) {
        currentValue.current = value;
    }

    return currentValue.current;
}
