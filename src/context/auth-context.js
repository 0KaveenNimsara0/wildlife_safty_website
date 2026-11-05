import { createContext } from 'react';

// Keep context identity separate from the hot-reloaded provider component.
export const AuthContext = createContext(undefined);
