import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div class="section-shell rounded-[2rem] p-8">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p class="eyebrow text-xs text-[#f26b38]">Cart</p>
              <h1 class="editorial-title mt-3 text-5xl leading-none text-slate-950">Your selected component packs</h1>
            </div>
            <a routerLink="/catalog" class="secondary-button rounded-full px-5 py-3 text-sm font-semibold transition">
              Continue browsing
            </a>
          </div>

          @if (cart.items().length === 0) {
            <div class="section-shell-dark mt-10 rounded-[1.75rem] p-10 text-center text-white">
              <div class="eyebrow text-xs text-[#f7c66f]">Nothing here yet</div>
              <h2 class="mt-4 text-3xl font-semibold">Start with the curated catalog.</h2>
              <p class="mt-4 text-sm leading-7 text-slate-300">
                Add a few packs and this screen will turn into a real order review with totals, quantities, and upgrade prompts.
              </p>
              <a routerLink="/catalog" class="secondary-button mt-6 inline-flex rounded-full px-5 py-3 text-sm font-semibold transition">
                Explore the vault
              </a>
            </div>
          } @else {
            <div class="mt-8 space-y-4">
              @for (item of cart.items(); track item.productId) {
                <div class="soft-card grid gap-5 rounded-[1.5rem] p-5 md:grid-cols-[1.1fr_0.4fr_0.4fr]">
                  <div class="flex gap-4">
                    <div class="flex h-24 w-24 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-[#102a43] to-[#f26b38] text-sm font-semibold uppercase tracking-[0.24em] text-white">
                      UI
                    </div>
                    <div>
                      <div class="text-2xl font-semibold text-slate-950">{{ item.name }}</div>
                      <div class="mt-2 text-sm leading-6 text-slate-600">Premium storefront UI with production-ready Tailwind markup and framework variants.</div>
                      <button (click)="cart.remove(item.productId)" class="mt-4 text-sm font-semibold text-[#f26b38]">Remove pack</button>
                    </div>
                  </div>

                  <div>
                    <div class="text-xs uppercase tracking-[0.24em] text-slate-400">Quantity</div>
                    <div class="mt-3 flex items-center gap-2">
                      <button (click)="decrementQuantity(item)" class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700">-</button>
                      <span class="inline-flex min-w-12 items-center justify-center rounded-full bg-slate-100 px-4 py-2 font-semibold text-slate-900">{{ item.quantity }}</span>
                      <button (click)="cart.updateQuantity(item.productId, item.quantity + 1)" class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700">+</button>
                    </div>
                  </div>

                  <div class="md:text-right">
                    <div class="text-xs uppercase tracking-[0.24em] text-slate-400">Subtotal</div>
                    <div class="mt-3 text-3xl font-semibold text-slate-950">\${{ item.price * item.quantity }}</div>
                    <div class="mt-2 text-sm text-slate-500">\${{ item.price }} per license</div>
                  </div>
                </div>
              }
            </div>
          }
        </div>

        <aside class="space-y-6">
          <div class="section-shell-dark rounded-[2rem] p-7 text-white">
            <div class="eyebrow text-xs text-[#f7c66f]">Order summary</div>
            <div class="mt-6 space-y-4">
              <div class="flex items-center justify-between text-sm text-slate-300">
                <span>Items</span>
                <span>{{ cart.count() }}</span>
              </div>
              <div class="flex items-center justify-between text-sm text-slate-300">
                <span>Delivery</span>
                <span>Instant</span>
              </div>
              <div class="flex items-center justify-between border-t border-white/10 pt-4 text-xl font-semibold text-white">
                <span>Total</span>
                <span>\${{ cart.total() }}</span>
              </div>
            </div>

            <a routerLink="/checkout" class="accent-button mt-6 inline-flex w-full items-center justify-center rounded-full px-5 py-4 text-sm font-semibold transition">
              Go to checkout
            </a>
          </div>

          <div class="section-shell rounded-[2rem] p-7">
            <div class="text-xs uppercase tracking-[0.24em] text-slate-500">Why buyers convert here</div>
            <div class="mt-5 space-y-4">
              @for (point of sellingPoints; track point.title) {
                <div class="rounded-[1.25rem] bg-[#f8f3e8] p-4">
                  <div class="font-semibold text-slate-950">{{ point.title }}</div>
                  <div class="mt-1 text-sm leading-6 text-slate-600">{{ point.description }}</div>
                </div>
              }
            </div>
          </div>
        </aside>
      </div>
    </section>
  `
})
export class CartComponent {
  cart = inject(CartService);

  decrementQuantity(item: { productId: string; quantity: number }) {
    if (item.quantity <= 1) {
      this.cart.remove(item.productId);
    } else {
      this.cart.updateQuantity(item.productId, item.quantity - 1);
    }
  }

  protected readonly sellingPoints = [
    { title: 'Instant delivery', description: 'Framework files and Tailwind-ready markup are available as soon as the order completes.' },
    { title: 'License clarity', description: 'Single-project and studio pricing stay visible through the whole journey.' },
    { title: 'Curated packs', description: 'The cart stays connected to catalog storytelling instead of becoming a dead utilitarian step.' },
  ];
}
