import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="section-shell rounded-[2rem] p-8">
        <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="eyebrow text-xs text-[#f26b38]">Internal operations</p>
            <h1 class="editorial-title mt-3 text-5xl leading-none text-slate-950">Admin control room</h1>
            <p class="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              The admin route is no longer an empty box. It now previews moderation, release planning, and growth tooling in the same visual language as the storefront.
            </p>
          </div>
          <div class="section-shell-dark rounded-[1.5rem] px-5 py-4 text-white">
            <div class="text-xs uppercase tracking-[0.24em] text-[#f7c66f]">Ops health</div>
            <div class="mt-2 text-3xl font-semibold">Stable</div>
          </div>
        </div>

        <div class="mt-8 grid gap-4 lg:grid-cols-3">
          @for (queue of queues; track queue.title) {
              <div class="soft-card rounded-[1.5rem] p-5">
              <div class="text-xs uppercase tracking-[0.24em] text-slate-400">{{ queue.kicker }}</div>
              <h2 class="mt-3 text-2xl font-semibold text-slate-950">{{ queue.title }}</h2>
              <div class="mt-4 text-4xl font-semibold text-[#102a43]">{{ queue.value }}</div>
              <p class="mt-3 text-sm leading-6 text-slate-600">{{ queue.description }}</p>
            </div>
          }
        </div>

        <div class="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div class="section-shell-dark rounded-[1.75rem] p-6 text-white">
            <div class="eyebrow text-xs text-[#f7c66f]">Launch board</div>
            <div class="mt-5 space-y-4">
              @for (item of launches; track item.name) {
                <div class="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                  <div class="flex items-center justify-between gap-4">
                    <div class="text-lg font-semibold">{{ item.name }}</div>
                    <span class="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-200">{{ item.status }}</span>
                  </div>
                  <p class="mt-2 text-sm text-slate-300">{{ item.description }}</p>
                </div>
              }
            </div>
          </div>

          <div class="space-y-4">
            @for (tool of tools; track tool.title) {
              <div class="section-shell rounded-[1.5rem] p-5">
                <div class="text-xs uppercase tracking-[0.24em] text-slate-400">{{ tool.kicker }}</div>
                <div class="mt-3 text-2xl font-semibold text-slate-950">{{ tool.title }}</div>
                <p class="mt-2 text-sm leading-6 text-slate-600">{{ tool.description }}</p>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `
})
export class AdminComponent {
  protected readonly queues = [
    { kicker: 'Moderation', title: 'Pending reviews', value: '14', description: 'New component submissions waiting for visual QA and framework parity review.' },
    { kicker: 'Revenue', title: 'Today’s orders', value: '$4.2k', description: 'Digital storefront purchases processed across single and studio licenses.' },
    { kicker: 'Support', title: 'Open tickets', value: '07', description: 'Customer requests on downloads, license moves, and implementation support.' },
  ];

  protected readonly launches = [
    { name: 'Dashboard Chrome', status: 'Design review', description: 'Final spacing and dark-surface variants queued for review.' },
    { name: 'Pricing Stories', status: 'Ready to publish', description: 'Copy locked, framework exports generated, screenshots in progress.' },
    { name: 'Admin Panels', status: 'Needs QA', description: 'Operational filters and moderation tables need responsive checks.' },
  ];

  protected readonly tools = [
    { kicker: 'Growth', title: 'Campaign queue', description: 'Coordinate launches, hero refreshes, and homepage merchandising windows.' },
    { kicker: 'Product ops', title: 'Framework parity', description: 'Track which packs have Angular, React, and Vue exports ready to ship.' },
    { kicker: 'Support', title: 'Escalation monitor', description: 'Keep account, billing, and download issues visible without leaving the admin surface.' },
  ];
}
