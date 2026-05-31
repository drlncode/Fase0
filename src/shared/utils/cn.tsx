import { clsx, type ClassValue} from 'clsx';
import { twMerge, type ClassNameValue } from 'tailwind-merge';

export function cn(...inputs: (ClassValue | ClassNameValue)[]) {
    return twMerge(clsx(inputs));
}
