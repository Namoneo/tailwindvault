import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from './core/services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell">
      <header class="sticky top-0 z-50 border-b border-white/60 bg-[#fffaf1]/85 backdrop-blur-xl">
        <nav class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a routerLink="/" class="flex items-center gap-3">
            <span class="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#102a43] text-sm font-semibold uppercase tracking-[0.28em] text-[#f7c66f]">TV</span>
              <div>
              <div class="editorial-title text-2xl leading-none tracking-tight">TailwindVault</div>
              <div class="text-xs uppercase tracking-[0.25em] text-slate-500">UI Archive</div>
            </div>
          </a>

          <div class="hidden items-center gap-2 lg:flex">
            @for (link of primaryLinks; track link.path) {
              <a
                [routerLink]="link.path"
                routerLinkActive="bg-[#102a43] text-white shadow-lg shadow-slate-900/10"
                [routerLinkActiveOptions]="link.exact ? { exact: true } : { exact: false }"
                class="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-900"
              >
                {{ link.label }}
              </a>
            }
          </div>

          <div class="flex items-center gap-3">
            <a routerLink="/cart" class="relative rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900">
              Cart
              @if (cartCount() > 0) {
                <span class="ml-2 inline-flex min-w-6 items-center justify-center rounded-full bg-[#f26b38] px-2 py-0.5 text-xs font-semibold text-white">
                  {{ cartCount() }}
                </span>
              }
            </a>

            <a routerLink="/auth" class="hidden rounded-full bg-[#102a43] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0b2236] sm:inline-flex">
              {{ isAuthenticated() ? 'Profile' : 'Sign In' }}
            </a>

            <button
              type="button"
              (click)="menuOpen.set(!menuOpen())"
              class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 lg:hidden"
            >
              <span class="sr-only">Toggle navigation</span>
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </nav>

        @if (menuOpen()) {
          <div class="border-t border-slate-200/80 bg-white/95 px-4 py-4 lg:hidden">
            <div class="mx-auto flex max-w-7xl flex-col gap-2">
              @for (link of allLinks; track link.path) {
                <a
                  [routerLink]="link.path"
                  (click)="menuOpen.set(false)"
                  class="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  {{ link.label }}
                </a>
              }
            </div>
          </div>
        }

        <div class="border-t border-white/60 bg-white/60">
          <div class="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 text-xs sm:px-6 lg:px-8">
            @for (link of allLinks; track link.path) {
              <a
                [routerLink]="link.path"
                class="route-chip whitespace-nowrap rounded-full px-3 py-1.5 font-medium uppercase tracking-[0.2em] text-slate-500 transition hover:border-[#f26b38] hover:text-[#102a43]"
              >
                {{ link.label }}
              </a>
            }
          </div>
        </div>
      </header>

      <main class="pb-16">
        <router-outlet></router-outlet>
      </main>

      <footer class="section-shell-dark border-t border-slate-200/70 py-12 text-white">
        <div class="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:px-8">
          <div class="space-y-4">
            <p class="eyebrow text-xs text-[#f7c66f]">Design systems that ship</p>
            <h2 class="editorial-title max-w-xl text-3xl leading-tight">A storefront, sandbox, and route atlas for every premium UI surface in the vault.</h2>
            <p class="max-w-2xl text-sm text-slate-300">
              Browse the catalog, inspect product pages, test checkout, and jump across admin and dashboard states without hunting for hidden routes.
            </p>
          </div>
          <div class="grid grid-cols-2 gap-3 text-sm text-slate-300">
            @for (link of allLinks; track link.path) {
              <a [routerLink]="link.path" class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-[#f7c66f]/50 hover:bg-white/10 hover:text-white">
                {{ link.label }}
              </a>
            }
          </div>
        </div>
      </footer>
    </div>
  `
})
export class AppComponent {
  private cart = inject(CartService);
  protected readonly primaryLinks = [
    { path: '/', label: 'Home', exact: true },
    { path: '/catalog', label: 'Catalog' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/admin', label: 'Admin' },
  ];
  protected readonly allLinks = [
    { path: '/', label: 'Home' },
    { path: '/catalog', label: 'Catalog' },
    { path: '/product/hero-sections', label: 'Product' },
    { path: '/cart', label: 'Cart' },
    { path: '/checkout', label: 'Checkout' },
    { path: '/auth', label: 'Auth' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/admin', label: 'Admin' },
  ];
  menuOpen = signal(false);
  cartCount = computed(() => this.cart.count());
  isAuthenticated = signal(false);
}
