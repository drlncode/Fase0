import { createContext } from 'react';
import type { AuthContextType } from '@auth/types/auth.types';

export const AuthContext = createContext<AuthContextType | null>(null);
