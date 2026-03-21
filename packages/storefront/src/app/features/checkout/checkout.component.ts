import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      @if (cart.items().length === 0) {
        <div class="section-shell-dark rounded-[2rem] p-10 text-center text-white">
          <div class="eyebrow text-xs text-[#f7c66f]">Checkout</div>
          <h1 class="mt-4 text-4xl font-semibold">Your cart is empty.</h1>
          <p class="mt-4 text-sm leading-7 text-slate-300">Add a few packs from the catalog first, then come back here to test the payment flow.</p>
          <a routerLink="/catalog" class="secondary-button mt-6 inline-flex rounded-full px-5 py-3 text-sm font-semibold transition">
            Browse the catalog
          </a>
        </div>
      } @else {
        <div class="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <aside class="space-y-6">
            <div class="section-shell-dark rounded-[2rem] p-7 text-white">
              <div class="eyebrow text-xs text-[#f7c66f]">Checkout flow</div>
              <h1 class="editorial-title mt-4 text-4xl leading-none">Complete your TailwindVault order</h1>
              <p class="mt-4 text-sm leading-7 text-slate-300">
                A premium purchase flow should still feel like part of the brand. This version treats checkout as a designed destination, not a forgotten utility page.
              </p>
            </div>

            <div class="section-shell rounded-[2rem] p-7">
              <div class="text-xs uppercase tracking-[0.24em] text-slate-500">Order summary</div>
              <div class="mt-5 space-y-4">
                @for (item of cart.items(); track item.productId) {
                  <div class="flex items-start justify-between gap-4 rounded-[1.25rem] bg-[#fffdf9] p-4">
                    <div>
                      <div class="font-semibold text-slate-950">{{ item.name }}</div>
                      <div class="mt-1 text-sm text-slate-500">{{ item.quantity }} license{{ item.quantity > 1 ? 's' : '' }}</div>
                    </div>
                    <div class="text-sm font-semibold text-slate-900">\${{ item.price * item.quantity }}</div>
                  </div>
                }
              </div>

              <div class="mt-5 rounded-[1.25rem] bg-[#f8f3e8] p-4">
                <div class="flex items-center justify-between text-sm text-slate-600">
                  <span>Delivery</span>
                  <span>Instant digital access</span>
                </div>
                <div class="mt-3 flex items-center justify-between text-xl font-semibold text-slate-950">
                  <span>Total</span>
                  <span>\${{ cart.total() }}</span>
                </div>
              </div>
            </div>
          </aside>

          <div class="section-shell rounded-[2rem] p-8">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div class="text-xs uppercase tracking-[0.24em] text-[#f26b38]">Payment</div>
                <h2 class="mt-3 text-3xl font-semibold text-slate-950">Secure checkout</h2>
              </div>
              <div class="rounded-full bg-[#f8f3e8] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">Test mode</div>
            </div>

            <form class="mt-8 space-y-5" (ngSubmit)="processPayment()">
              <div>
                <label class="text-xs uppercase tracking-[0.22em] text-slate-500">Email</label>
                <input type="email" [(ngModel)]="email" name="email" class="input-shell mt-2 w-full rounded-2xl px-4 py-4 text-slate-900 transition" />
              </div>

              <div>
                <label class="text-xs uppercase tracking-[0.22em] text-slate-500">Card number</label>
                <input type="text" [(ngModel)]="cardNumber" name="cardNumber" placeholder="4242 4242 4242 4242" class="input-shell mt-2 w-full rounded-2xl px-4 py-4 text-slate-900 transition" />
              </div>

              <div class="grid gap-5 md:grid-cols-2">
                <div>
                  <label class="text-xs uppercase tracking-[0.22em] text-slate-500">Expiry</label>
                  <input type="text" [(ngModel)]="expiry" name="expiry" placeholder="MM/YY" class="input-shell mt-2 w-full rounded-2xl px-4 py-4 text-slate-900 transition" />
                </div>
                <div>
                  <label class="text-xs uppercase tracking-[0.22em] text-slate-500">CVC</label>
                  <input type="text" [(ngModel)]="cvc" name="cvc" placeholder="123" class="input-shell mt-2 w-full rounded-2xl px-4 py-4 text-slate-900 transition" />
                </div>
              </div>

              <div class="rounded-[1.5rem] bg-[#f8f3e8] p-5 text-sm leading-6 text-slate-700">
                <div class="font-semibold text-slate-950">Included with every order</div>
                <ul class="mt-3 space-y-2">
                  @for (item of assurances; track item) {
                    <li>{{ item }}</li>
                  }
                </ul>
              </div>

              <button type="submit" [disabled]="processing()" class="brand-button w-full rounded-full px-6 py-4 text-sm font-semibold transition disabled:opacity-50">
                @if (processing()) {
                  Processing order...
                } @else {
                  Pay \${{ cart.total() }}
                }
              </button>
            </form>
          </div>
        </div>
      }
    </section>
  `
})
export class CheckoutComponent {
  cart = inject(CartService);

  email = '';
  cardNumber = '';
  expiry = '';
  cvc = '';
  processing = signal(false);

  protected readonly assurances = [
    'Instant access to downloaded files after purchase',
    'License details preserved in your customer dashboard',
    'Team upgrades available later without losing the original order',
  ];

  processPayment() {
    this.processing.set(true);
    setTimeout(() => {
      this.cart.clear();
      this.processing.set(false);
      alert('Payment successful!');
    }, 2000);
  }
}
