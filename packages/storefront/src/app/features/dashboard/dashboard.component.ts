import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

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
              <h1 class="editorial-title text-5xl leading-none text-slate-950">Dashboard</h1>
              <p class="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                This is now a real account overview: current licenses, recent activity, and the next actions a buyer would reasonably need.
              </p>
            </div>
            <a routerLink="/catalog" class="brand-button rounded-full px-5 py-3 text-sm font-semibold transition">
              Add another pack
            </a>
          </div>

          <div class="mt-8 grid gap-4 md:grid-cols-3">
            @for (metric of metrics; track metric.label) {
              <div class="metric-card rounded-[1.5rem] p-5">
                <div class="text-xs uppercase tracking-[0.24em] text-slate-500">{{ metric.label }}</div>
                <div class="mt-3 text-3xl font-semibold text-slate-950">{{ metric.value }}</div>
                <div class="mt-2 text-sm text-slate-600">{{ metric.note }}</div>
              </div>
            }
          </div>

          <div class="mt-8 grid gap-4 xl:grid-cols-2">
            @for (license of licenses; track license.name) {
              <div class="soft-card rounded-[1.5rem] p-5">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <div class="text-xs uppercase tracking-[0.24em] text-slate-400">{{ license.plan }}</div>
                    <h2 class="mt-2 text-2xl font-semibold text-slate-950">{{ license.name }}</h2>
                  </div>
                  <span class="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em]" [class.bg-emerald-100]="license.status === 'Active'" [class.text-emerald-700]="license.status === 'Active'" [class.bg-amber-100]="license.status !== 'Active'" [class.text-amber-700]="license.status !== 'Active'">
                    {{ license.status }}
                  </span>
                </div>
                <p class="mt-3 text-sm leading-6 text-slate-600">{{ license.description }}</p>
                <div class="mt-5 flex items-center justify-between text-sm">
                  <div class="text-slate-500">Renewal {{ license.renewal }}</div>
                  <a routerLink="/product/hero-sections" class="font-semibold text-[#102a43]">View pack</a>
                </div>
              </div>
            }
          </div>
        </div>

        <div class="space-y-6">
          <div class="section-shell-dark rounded-[2rem] p-7 text-white">
            <div class="eyebrow text-xs text-[#f7c66f]">Recent activity</div>
            <div class="mt-5 space-y-4">
              @for (event of timeline; track event.title) {
                <div class="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <div class="text-sm font-semibold">{{ event.title }}</div>
                  <div class="mt-1 text-sm text-slate-300">{{ event.detail }}</div>
                  <div class="mt-3 text-xs uppercase tracking-[0.2em] text-slate-400">{{ event.when }}</div>
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
export class DashboardComponent {
  protected readonly metrics = [
    { label: 'Purchases', value: '06', note: 'Six packs licensed across marketing and app surfaces.' },
    { label: 'Downloads', value: '18', note: 'Recent downloads across Angular and React variants.' },
    { label: 'Seats', value: '12', note: 'Team members covered by your current studio license.' },
  ];

  protected readonly licenses = [
    { plan: 'Studio license', name: 'Hero Sections', status: 'Active', description: 'Editorial hero blocks and launch sections for all three frameworks.', renewal: 'Oct 2026' },
    { plan: 'Single project', name: 'Checkout Flow', status: 'Active', description: 'Cart, checkout, receipt, and post-purchase UI with digital product patterns.', renewal: 'Never' },
    { plan: 'Upgrade available', name: 'Dashboard Chrome', status: 'Review', description: 'Internal account and analytics surfaces, ready for a team-wide unlock.', renewal: 'Upgrade now' },
  ];

  protected readonly timeline = [
    { title: 'Downloaded Angular files', detail: 'Hero Sections package downloaded with SSR-ready templates.', when: '2 hours ago' },
    { title: 'Order completed', detail: 'Checkout Flow purchased for the growth site redesign.', when: 'Yesterday' },
    { title: 'License shared', detail: 'Studio access granted to three additional designers.', when: 'This week' },
  ];

  protected readonly actions = [
    { title: 'Open the catalog', description: 'Find another pack that matches your current design direction.', path: '/catalog' },
    { title: 'Test checkout', description: 'Walk through the purchase flow with the current visual system.', path: '/checkout' },
    { title: 'Review admin tools', description: 'Inspect internal moderation and release tooling screens.', path: '/admin' },
  ];
}
