import { createContext, useContext } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useAuth() {
  return {};
}