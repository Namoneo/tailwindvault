import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <div class="section-shell-dark rounded-[2rem] p-8 text-white">
        <p class="eyebrow text-xs text-[#f7c66f]">Access the vault</p>
        <h1 class="editorial-title mt-4 text-5xl leading-none">{{ isLogin() ? 'Sign in to keep shipping faster.' : 'Create your TailwindVault account.' }}</h1>
        <p class="mt-5 max-w-xl text-base leading-7 text-slate-300">
          Save purchases, track licenses, and jump from component discovery into checkout without losing context.
        </p>

        <div class="mt-10 space-y-4">
          @for (benefit of benefits; track benefit.title) {
            <div class="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <div class="text-lg font-semibold text-white">{{ benefit.title }}</div>
              <div class="mt-2 text-sm leading-6 text-slate-300">{{ benefit.description }}</div>
            </div>
          }
        </div>

        <div class="mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
          <div class="text-xs uppercase tracking-[0.24em] text-[#f7c66f]">Demo accounts</div>
          <div class="mt-4 space-y-3">
            @for (account of demoAccounts; track account.email) {
              <button
                type="button"
                (click)="useDemoAccount(account.email, account.password)"
                class="w-full rounded-[1.25rem] border border-white/10 px-4 py-3 text-left transition hover:border-[#f7c66f]/60"
              >
                <div class="text-sm font-semibold text-white">{{ account.label }}</div>
                <div class="mt-1 text-xs text-slate-300">{{ account.email }} / {{ account.password }}</div>
              </button>
            }
          </div>
        </div>

        <div class="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
          <a routerLink="/catalog" class="rounded-full border border-white/15 px-4 py-2 transition hover:border-[#f7c66f]/60 hover:text-white">
            Explore catalog
          </a>
          <a routerLink="/dashboard" class="rounded-full border border-white/15 px-4 py-2 transition hover:border-[#f7c66f]/60 hover:text-white">
            Preview dashboard
          </a>
        </div>
      </div>

      <div class="section-shell rounded-[2rem] p-8">
        <div class="flex items-start justify-between gap-6">
          <div>
            <div class="text-xs uppercase tracking-[0.24em] text-[#f26b38]">{{ isLogin() ? 'Member sign in' : 'New account' }}</div>
            <h2 class="mt-3 text-3xl font-semibold text-slate-950">{{ isLogin() ? 'Welcome back' : 'Set up your workspace' }}</h2>
          </div>
          <button
            type="button"
            (click)="toggle()"
            class="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-[#102a43] hover:text-slate-950"
          >
            {{ isLogin() ? 'Need an account?' : 'Already a member?' }}
          </button>
        </div>

        @if (error()) {
          <div class="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {{ error() }}
          </div>
        }

        <form (ngSubmit)="submit()" class="mt-8 space-y-5">
          @if (!isLogin()) {
            <div>
              <label class="text-xs uppercase tracking-[0.22em] text-slate-500">Display name</label>
              <input
                type="text"
                [(ngModel)]="name"
                name="name"
                required
                class="input-shell mt-2 w-full rounded-2xl px-4 py-4 text-slate-900 transition"
              />
            </div>
          }

          <div>
            <label class="text-xs uppercase tracking-[0.22em] text-slate-500">Email address</label>
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              required
              class="input-shell mt-2 w-full rounded-2xl px-4 py-4 text-slate-900 transition"
            />
          </div>

          <div>
            <label class="text-xs uppercase tracking-[0.22em] text-slate-500">Password</label>
            <input
              type="password"
              [(ngModel)]="password"
              name="password"
              required
              class="input-shell mt-2 w-full rounded-2xl px-4 py-4 text-slate-900 transition"
            />
          </div>

          <div class="rounded-[1.5rem] bg-[#f8f3e8] p-5 text-sm leading-6 text-slate-700">
            <div class="font-semibold text-slate-950">{{ isLogin() ? 'What you get after sign in' : 'What happens after account creation' }}</div>
            <ul class="mt-3 space-y-2">
              @for (item of accountStates(); track item) {
                <li>{{ item }}</li>
              }
            </ul>
          </div>

          <button
            type="submit"
            [disabled]="loading()"
            class="brand-button w-full rounded-full px-6 py-4 text-sm font-semibold transition disabled:opacity-60"
          >
            @if (loading()) {
              {{ isLogin() ? 'Signing in…' : 'Creating account…' }}
            } @else {
              {{ isLogin() ? 'Sign In to TailwindVault' : 'Create Account' }}
            }
          </button>
        </form>
      </div>
    </section>
  `,
})
export class AuthComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLogin = signal(true);
  loading = signal(false);
  error = signal<string | null>(null);
  email = '';
  password = '';
  name = '';

  protected readonly benefits = [
    {
      title: 'License tracking',
      description: 'See every purchase, download, and renewal in one customer workspace.',
    },
    {
      title: 'Framework access',
      description: 'Move between Angular, React, and Vue deliverables without leaving the same account.',
    },
    {
      title: 'Faster iteration',
      description: 'Keep the storefront, sandbox, and admin routes connected so previews feel intentional.',
    },
  ];

  protected readonly accountStates = signal([
    'Saved component purchases and license history',
    'Account dashboard access and team upgrade prompts',
    'Faster checkout with remembered identity details',
  ]);

  protected readonly demoAccounts = [
    { label: 'Admin demo', email: 'admin@tailwindvault.dev', password: 'AdminPass123!' },
    { label: 'Buyer demo', email: 'buyer@tailwindvault.dev', password: 'BuyerPass123!' },
  ];

  toggle(): void {
    this.isLogin.set(!this.isLogin());
    this.error.set(null);
    this.accountStates.set(
      this.isLogin()
        ? [
            'Saved component purchases and license history',
            'Account dashboard access and team upgrade prompts',
            'Faster checkout with remembered identity details',
          ]
        : [
            'New workspace creation with starter profile details',
            'Immediate access to catalog saves and future order history',
            'Ability to manage team licenses from the dashboard',
          ]
    );
  }

  useDemoAccount(email: string, password: string): void {
    this.email = email;
    this.password = password;
    this.name = email.startsWith('admin') ? 'TailwindVault Admin' : 'TailwindVault Buyer';
  }

  async submit(): Promise<void> {
    this.error.set(null);

    if (!this.email || !this.password) {
      this.error.set('Please fill in all required fields.');
      return;
    }

    if (!this.isLogin() && !this.name.trim()) {
      this.error.set('Display name is required.');
      return;
    }

    this.loading.set(true);

    try {
      const result = this.isLogin()
        ? await this.authService.login(this.email, this.password)
        : await this.authService.register(this.name, this.email, this.password);

      if (result.success) {
        await this.router.navigate([this.authService.isAdmin() ? '/admin' : '/dashboard']);
      } else {
        this.error.set(result.error ?? 'Authentication failed. Please try again.');
      }
    } catch {
      this.error.set('Something went wrong. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }
}
