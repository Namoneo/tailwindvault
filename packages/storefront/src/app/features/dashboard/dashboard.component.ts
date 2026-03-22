import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom, forkJoin } from 'rxjs';
import { License } from '../../core/models/license.model';
import { OrderSummary } from '../../core/models/order.model';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div class="section-shell rounded-[2rem] p-8">
          <p class="eyebrow text-xs text-[#f26b38]">Customer workspace</p>
          <div class="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 class="editorial-title text-5xl leading-none text-slate-950">{{ auth.user()?.name || 'TailwindVault' }}</h1>
              <p class="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Purchased component packs, active licenses, and recent order activity all stay in one place.
              </p>
            </div>
            <a routerLink="/catalog" class="brand-button rounded-full px-5 py-3 text-sm font-semibold transition">
              Add another pack
            </a>
          </div>

          @if (loading()) {
            <div class="mt-8 grid gap-4 md:grid-cols-3">
              @for (index of [1, 2, 3]; track index) {
                <div class="h-36 rounded-[1.5rem] bg-white/70 animate-pulse"></div>
              }
            </div>
            <div class="mt-8 grid gap-4 xl:grid-cols-2">
              @for (index of [1, 2, 3, 4]; track index) {
                <div class="h-52 rounded-[1.5rem] bg-white/70 animate-pulse"></div>
              }
            </div>
          } @else if (error()) {
            <div class="mt-8 rounded-[1.5rem] border border-red-200 bg-red-50 p-5 text-sm text-red-700">
              {{ error() }}
            </div>
          } @else if (licenses().length === 0) {
            <div class="section-shell-dark mt-8 rounded-[1.75rem] p-10 text-center text-white">
              <div class="eyebrow text-xs text-[#f7c66f]">No licenses yet</div>
              <h2 class="mt-4 text-3xl font-semibold">Your purchases will show up here after checkout.</h2>
              <p class="mt-4 text-sm leading-7 text-slate-300">
                Buy a component pack, then return to this dashboard for download links and license validation.
              </p>
              <a routerLink="/catalog" class="secondary-button mt-6 inline-flex rounded-full px-5 py-3 text-sm font-semibold transition">
                Browse the catalog
              </a>
            </div>
          } @else {
            <div class="mt-8 grid gap-4 md:grid-cols-3">
              @for (metric of metrics(); track metric.label) {
                <div class="metric-card rounded-[1.5rem] p-5">
                  <div class="text-xs uppercase tracking-[0.24em] text-slate-500">{{ metric.label }}</div>
                  <div class="mt-3 text-3xl font-semibold text-slate-950">{{ metric.value }}</div>
                  <div class="mt-2 text-sm text-slate-600">{{ metric.note }}</div>
                </div>
              }
            </div>

            <div class="mt-8 grid gap-4 xl:grid-cols-2">
              @for (license of licenses(); track license.id) {
                <div class="soft-card rounded-[1.5rem] p-5">
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <div class="text-xs uppercase tracking-[0.24em] text-slate-400">License code</div>
                      <h2 class="mt-2 text-2xl font-semibold text-slate-950">{{ license.productName }}</h2>
                    </div>
                    <span
                      class="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em]"
                      [class.bg-emerald-100]="license.status === 'active'"
                      [class.text-emerald-700]="license.status === 'active'"
                      [class.bg-amber-100]="license.status !== 'active'"
                      [class.text-amber-700]="license.status !== 'active'"
                    >
                      {{ license.status }}
                    </span>
                  </div>
                  <p class="mt-3 text-sm leading-6 text-slate-600">{{ license.code }}</p>
                  <div class="mt-5 flex flex-wrap gap-3 text-sm">
                    <a
                      [href]="downloadUrl(license.downloadUrl)"
                      target="_blank"
                      rel="noreferrer"
                      class="brand-button rounded-full px-4 py-2 font-semibold transition"
                    >
                      Download
                    </a>
                    <a [routerLink]="['/product', license.productSlug]" class="secondary-button rounded-full px-4 py-2 font-semibold transition">
                      View pack
                    </a>
                    <span class="inline-flex items-center rounded-full bg-[#f8f3e8] px-4 py-2 text-slate-700">
                      Added {{ formatDate(license.createdAt) }}
                    </span>
                  </div>
                </div>
              }
            </div>
          }
        </div>

        <div class="space-y-6">
          <div class="section-shell-dark rounded-[2rem] p-7 text-white">
            <div class="eyebrow text-xs text-[#f7c66f]">Recent activity</div>
            <div class="mt-5 space-y-4">
              @for (event of recentOrders(); track event.id) {
                <div class="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <div class="text-sm font-semibold">Order #{{ event.id }} · {{ event.status }}</div>
                  <div class="mt-1 text-sm text-slate-300">{{ orderItemNames(event) }}</div>
                  <div class="mt-3 text-xs uppercase tracking-[0.2em] text-slate-400">
                    {{ formatDate(event.createdAt) }} · \${{ event.total }}
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="section-shell rounded-[2rem] p-7">
            <div class="text-xs uppercase tracking-[0.26em] text-slate-500">Next actions</div>
            <div class="mt-5 grid gap-3">
              @for (action of actions; track action.title) {
                <a [routerLink]="action.path" class="rounded-[1.25rem] border border-slate-200 px-4 py-4 transition hover:border-[#f26b38] hover:bg-[#fff8ee]">
                  <div class="text-lg font-semibold text-slate-950">{{ action.title }}</div>
                  <div class="mt-1 text-sm text-slate-600">{{ action.description }}</div>
                </a>
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class DashboardComponent implements OnInit {
  protected readonly auth = inject(AuthService);
  private readonly api = inject(ApiService);
  protected readonly licenses = signal<License[]>([]);
  protected readonly orders = signal<OrderSummary[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly metrics = computed(() => [
    {
      label: 'Licenses',
      value: String(this.licenses().length).padStart(2, '0'),
      note: 'Active product licenses tied to your account.'
    },
    {
      label: 'Orders',
      value: String(this.orders().length).padStart(2, '0'),
      note: 'Completed and pending checkout attempts.'
    },
    {
      label: 'Categories',
      value: String(new Set(this.licenses().map((license) => license.productSlug)).size).padStart(2, '0'),
      note: 'Distinct product packs available for download.'
    }
  ]);

  protected readonly recentOrders = computed(() => this.orders().slice(0, 3));

  protected readonly actions = [
    { title: 'Open the catalog', description: 'Find another pack that matches your current design direction.', path: '/catalog' },
    { title: 'Test checkout', description: 'Walk through the purchase flow with the current visual system.', path: '/checkout' },
    { title: 'Review admin tools', description: 'Inspect internal moderation and release tooling screens.', path: '/admin' },
  ];

  async ngOnInit(): Promise<void> {
    await this.loadDashboard();
  }

  downloadUrl(path: string): string {
    return this.api.resolveApiUrl(path);
  }

  formatDate(value: string | null): string {
    if (!value) {
      return 'Pending';
    }

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(value));
  }

  orderItemNames(order: OrderSummary): string {
    return order.items?.map((item) => item.productName).join(', ') || 'No items recorded';
  }

  private async loadDashboard(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const result = await firstValueFrom(
        forkJoin({
          licenses: this.api.getLicenses(),
          orders: this.api.getOrders()
        })
      );

      this.licenses.set(result.licenses);
      this.orders.set(result.orders);
    } catch {
      this.error.set('We could not load your dashboard data. Please sign in again.');
    } finally {
      this.loading.set(false);
    }
  }
}
