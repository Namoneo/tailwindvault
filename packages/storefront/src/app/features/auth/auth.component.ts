import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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

        <form (ngSubmit)="submit()" class="mt-8 space-y-5">
          @if (!isLogin()) {
            <div>
              <label class="text-xs uppercase tracking-[0.22em] text-slate-500">Display name</label>
              <input type="text" [(ngModel)]="name" name="name" class="input-shell mt-2 w-full rounded-2xl px-4 py-4 text-slate-900 transition" />
            </div>
          }

          <div>
            <label class="text-xs uppercase tracking-[0.22em] text-slate-500">Email address</label>
            <input type="email" [(ngModel)]="email" name="email" class="input-shell mt-2 w-full rounded-2xl px-4 py-4 text-slate-900 transition" />
          </div>

          <div>
            <label class="text-xs uppercase tracking-[0.22em] text-slate-500">Password</label>
            <input type="password" [(ngModel)]="password" name="password" class="input-shell mt-2 w-full rounded-2xl px-4 py-4 text-slate-900 transition" />
          </div>

          <div class="rounded-[1.5rem] bg-[#f8f3e8] p-5 text-sm leading-6 text-slate-700">
            <div class="font-semibold text-slate-950">{{ isLogin() ? 'What you get after sign in' : 'What happens after account creation' }}</div>
            <ul class="mt-3 space-y-2">
              @for (item of accountStates(); track item) {
                <li>{{ item }}</li>
              }
            </ul>
          </div>

          <button type="submit" class="brand-button w-full rounded-full px-6 py-4 text-sm font-semibold transition">
            {{ isLogin() ? 'Sign In to TailwindVault' : 'Create Account' }}
          </button>
        </form>
      </div>
    </section>
  `
})
export class AuthComponent {
  isLogin = signal(true);
  email = '';
  password = '';
  name = '';

  protected readonly benefits = [
    { title: 'License tracking', description: 'See every purchase, download, and renewal in one customer workspace.' },
    { title: 'Framework access', description: 'Move between Angular, React, and Vue deliverables without leaving the same account.' },
    { title: 'Faster iteration', description: 'Keep the storefront, sandbox, and admin routes connected so previews feel intentional.' },
  ];

  protected readonly accountStates = signal([
    'Saved component purchases and license history',
    'Account dashboard access and team upgrade prompts',
    'Faster checkout with remembered identity details',
  ]);

  toggle() {
    this.isLogin.set(!this.isLogin());
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

  submit() {
    console.log('Auth:', { email: this.email, password: this.password, name: this.name });
  }
}
