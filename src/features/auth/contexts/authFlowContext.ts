import { createContext } from 'react';
import type { AuthFlowContextType } from '@auth/types/auth.types';

export const AuthFlowContext = createContext<AuthFlowContextType | null>(null);
