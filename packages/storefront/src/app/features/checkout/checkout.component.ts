import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { OrderSummary } from '../../core/models/order.model';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      @if (successOrder()) {
        <div class="section-shell rounded-[2rem] p-10">
          <div class="text-xs uppercase tracking-[0.24em] text-[#f26b38]">Payment complete</div>
          <h1 class="editorial-title mt-4 text-5xl leading-none text-slate-950">Your TailwindVault order is ready.</h1>
          <p class="mt-5 max-w-2xl text-base leading-7 text-slate-600">
            Order #{{ successOrder()?.id }} has been marked as paid and your licenses are available from the dashboard.
          </p>

          <div class="mt-8 grid gap-4 md:grid-cols-3">
            <div class="metric-card rounded-[1.5rem] p-5">
              <div class="text-xs uppercase tracking-[0.24em] text-slate-500">Order total</div>
              <div class="mt-3 text-3xl font-semibold text-slate-950">\${{ successOrder()?.total }}</div>
            </div>
            <div class="metric-card rounded-[1.5rem] p-5">
              <div class="text-xs uppercase tracking-[0.24em] text-slate-500">Status</div>
              <div class="mt-3 text-3xl font-semibold text-slate-950">{{ successOrder()?.status }}</div>
            </div>
            <div class="metric-card rounded-[1.5rem] p-5">
              <div class="text-xs uppercase tracking-[0.24em] text-slate-500">Items</div>
              <div class="mt-3 text-3xl font-semibold text-slate-950">{{ successOrder()?.items?.length ?? 0 }}</div>
            </div>
          </div>

          <div class="mt-8 flex flex-wrap gap-3">
            <a routerLink="/dashboard" class="brand-button rounded-full px-6 py-3 text-sm font-semibold transition">
              Open dashboard
            </a>
            <a routerLink="/catalog" class="secondary-button rounded-full px-6 py-3 text-sm font-semibold transition">
              Keep browsing
            </a>
            @if (!auth.isAuthenticated()) {
              <a routerLink="/auth" class="secondary-button rounded-full px-6 py-3 text-sm font-semibold transition">
                Sign in to view licenses
              </a>
            }
          </div>
        </div>
      } @else if (confirming()) {
        <div class="section-shell-dark rounded-[2rem] p-10 text-center text-white">
          <div class="eyebrow text-xs text-[#f7c66f]">Confirming payment</div>
          <h1 class="mt-4 text-4xl font-semibold">Finalizing your mock Stripe checkout…</h1>
          <p class="mt-4 text-sm leading-7 text-slate-300">
            This MVP simulates Stripe returning to the storefront, then posts a checkout completion event to the API.
          </p>
        </div>
      } @else if (cart.cartItems().length === 0) {
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
                @for (item of cart.cartItems(); track item.id) {
                  <div class="flex items-start justify-between gap-4 rounded-[1.25rem] bg-[#fffdf9] p-4">
                    <div>
                      <div class="font-semibold text-slate-950">{{ item.name }}</div>
                      <div class="mt-1 text-sm text-slate-500">
                        {{ item.quantity }} {{ item.licenseType === 'team' ? 'studio' : 'single' }} license{{ item.quantity > 1 ? 's' : '' }}
                      </div>
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

              @if (error()) {
                <div class="rounded-[1.5rem] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {{ error() }}
                </div>
              }

              <button type="submit" [disabled]="processing()" class="brand-button w-full rounded-full px-6 py-4 text-sm font-semibold transition disabled:opacity-50">
                @if (processing()) {
                  Redirecting to mock Stripe…
                } @else {
                  Buy now via Stripe Checkout
                }
              </button>

              <p class="text-xs leading-6 text-slate-500">
                MVP note: this flow uses a mocked Stripe return URL and simulated webhook so the storefront and API can be tested end-to-end.
              </p>
            </form>
          </div>
        </div>
      }
    </section>
  `
})
export class CheckoutComponent implements OnInit {
  protected readonly cart = inject(CartService);
  protected readonly auth = inject(AuthService);
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  email = '';
  cardNumber = '4242 4242 4242 4242';
  expiry = '12/34';
  cvc = '123';
  protected readonly processing = signal(false);
  protected readonly confirming = signal(false);
  protected readonly successOrder = signal<OrderSummary | null>(null);
  protected readonly error = signal<string | null>(null);

  protected readonly assurances = [
    'Instant access to downloaded files after purchase',
    'License details preserved in your customer dashboard',
    'Team upgrades available later without losing the original order',
  ];

  ngOnInit(): void {
    this.email = this.auth.user()?.email ?? '';

    const params = this.route.snapshot.queryParamMap;
    if (params.get('success') === '1') {
      const orderId = Number(params.get('orderId'));
      const sessionId = params.get('session_id') ?? undefined;

      if (orderId) {
        void this.confirmPayment(orderId, sessionId);
      }
    }
  }

  async processPayment(): Promise<void> {
    if (!this.email.trim()) {
      this.error.set('An email address is required for digital delivery.');
      return;
    }

    this.processing.set(true);

    try {
      const order = await firstValueFrom(
        this.api.createOrder({
          email: this.email.trim().toLowerCase(),
          items: this.cart.cartItems().map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            licenseType: item.licenseType
          }))
        })
      );

      if (!order.checkoutUrl) {
        this.error.set('Unable to create a checkout session.');
        return;
      }

      window.location.assign(order.checkoutUrl);
    } catch {
      this.error.set('Unable to start checkout right now. Please try again.');
    } finally {
      this.processing.set(false);
    }
  }

  private async confirmPayment(orderId: number, sessionId?: string): Promise<void> {
    this.confirming.set(true);
    this.error.set(null);

    try {
      const result = await firstValueFrom(
        this.api.triggerStripeWebhook({
          type: 'checkout.session.completed',
          data: {
            object: {
              orderId,
              sessionId
            }
          }
        })
      );

      if (result.order) {
        this.successOrder.set(result.order);
        this.cart.clearCart();
        await this.router.navigate([], {
          relativeTo: this.route,
          replaceUrl: true,
          queryParams: {
            complete: 1,
            orderId: result.order.id
          }
        });
      }
    } catch {
      this.error.set('We could not confirm the payment return.');
    } finally {
      this.confirming.set(false);
    }
  }
}
