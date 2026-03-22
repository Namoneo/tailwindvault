import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { User, AuthState } from '../models/user.model';
import { ApiService } from './api.service';
import { clearStoredAuthState, readStoredAuthState, writeStoredAuthState } from './auth.storage';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  private state = signal<AuthState>(this.loadState());

  readonly user = computed(() => this.state().user);
  readonly token = computed(() => this.state().token);
  readonly isAuthenticated = computed(() => this.state().isAuthenticated);
  readonly isAdmin = computed(() => this.user()?.role === 'admin');

  private loadState(): AuthState {
    const storedState = readStoredAuthState();
    return {
      user: storedState.user,
      token: storedState.token,
      isAuthenticated: !!(storedState.token && storedState.user)
    };
  }

  private saveState(state: AuthState): void {
    writeStoredAuthState({ user: state.user, token: state.token });
    this.state.set(state);
  }

  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    if (!email || !password) {
      return { success: false, error: 'Email and password are required.' };
    }

    try {
      const response = await firstValueFrom(this.api.login({ email, password }));
      this.saveState({
        user: response.user,
        token: response.accessToken,
        isAuthenticated: true
      });
      return { success: true };
    } catch {
      return { success: false, error: 'Invalid email or password.' };
    }
  }

  async register(name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> {
    if (!name || !email || !password) {
      return { success: false, error: 'All fields are required.' };
    }

    try {
      const response = await firstValueFrom(this.api.register({ name, email, password }));
      this.saveState({
        user: response.user,
        token: response.accessToken,
        isAuthenticated: true
      });
      return { success: true };
    } catch {
      return { success: false, error: 'Unable to create your account.' };
    }
  }

  logout(): void {
    clearStoredAuthState();
    this.state.set({ user: null, token: null, isAuthenticated: false });
    this.router.navigate(['/']);
  }
}
