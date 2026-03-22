import { User } from '../models/user.model';

export const AUTH_STORAGE_KEY = 'tailwindvault_auth';

export interface StoredAuthState {
  user: User | null;
  token: string | null;
}

export function readStoredAuthState(): StoredAuthState {
  if (typeof localStorage === 'undefined') {
    return { user: null, token: null };
  }

  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return { user: null, token: null };
    }

    const parsed = JSON.parse(raw) as StoredAuthState;
    return {
      user: parsed.user ?? null,
      token: parsed.token ?? null
    };
  } catch {
    return { user: null, token: null };
  }
}

export function writeStoredAuthState(state: StoredAuthState): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
}

export function clearStoredAuthState(): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.removeItem(AUTH_STORAGE_KEY);
}
