import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getMe, login as loginRequest, registerUser } from '../api/auth';
import { getToken, setOnUnauthorized, setToken } from '../api/http';
import type { UserProfileResponse } from '../api/types';

interface AuthContextValue {
  token: string | null;
  user: UserProfileResponse | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => getToken());
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(Boolean(getToken()));

  const logout = () => {
    setToken(null);
    setTokenState(null);
    setUser(null);
  };

  const refresh = async () => {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const profile = await getMe();
      setUser(profile);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setOnUnauthorized(logout);
    if (token) void refresh();
    else setLoading(false);
    return () => setOnUnauthorized(null);
  }, [token]);

  const login = async (email: string, password: string) => {
    const { tokenJWT } = await loginRequest(email, password);
    // Grava o JWT no storage para o getMe autenticar, mas só atualiza o
    // estado React depois do perfil. Se setTokenState vier antes, o Login
    // redireciona ao Dashboard enquanto getMe ainda cria as plantas — e o
    // Promise.all do Dashboard compete no ensureRows (409).
    setToken(tokenJWT);
    setLoading(true);
    try {
      const profile = await getMe();
      setUser(profile);
      setTokenState(tokenJWT);
    } catch (err) {
      setToken(null);
      setTokenState(null);
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    await registerUser({ name, email, password });
  };

  const value = useMemo<AuthContextValue>(
    () => ({ token, user, loading, login, register, logout, refresh }),
    [token, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro do AuthProvider');
  return ctx;
}
