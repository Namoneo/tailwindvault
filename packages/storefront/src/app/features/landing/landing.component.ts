import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="relative overflow-hidden">
      <div class="hero-atmosphere"></div>
      <div class="relative mx-auto grid max-w-7xl gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-24">
        <div class="space-y-8">
          <div class="eyebrow inline-flex rounded-full border border-[#f7c66f]/70 bg-white/80 px-4 py-2 text-xs font-semibold text-[#102a43]">
            Marketplace + Preview Lab
          </div>
          <div class="space-y-5">
            <h1 class="editorial-title max-w-3xl text-5xl leading-[0.95] tracking-tight text-slate-950 sm:text-6xl">
              Premium Tailwind UI that feels curated, not copied.
            </h1>
            <p class="max-w-2xl text-lg leading-8 text-slate-600">
              TailwindVault bundles catalog discovery, framework-ready components, purchase flows, and internal tooling into one storefront. This frontend now exposes every major surface so you can actually inspect the whole product.
            </p>
          </div>

          <div class="flex flex-wrap gap-3">
            <a routerLink="/catalog" class="brand-button rounded-full px-6 py-3 text-sm font-semibold transition">
              Browse the catalog
            </a>
            <a routerLink="/product/hero-sections" class="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-[#f26b38] hover:text-[#102a43]">
              Open a product page
            </a>
          </div>

          <div class="grid gap-4 sm:grid-cols-3">
            @for (stat of stats; track stat.label) {
              <div class="rounded-[1.75rem] border border-white/70 bg-white/75 p-5 shadow-[0_20px_60px_-30px_rgba(16,42,67,0.35)] backdrop-blur">
                <div class="text-3xl font-semibold text-slate-950">{{ stat.value }}</div>
                <div class="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">{{ stat.label }}</div>
              </div>
            }
          </div>
        </div>

        <div class="grid gap-4">
          <div class="section-shell-dark rounded-[2rem] border border-slate-200/70 p-7 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs uppercase tracking-[0.3em] text-[#f7c66f]">Live surfaces</p>
                <h2 class="editorial-title mt-2 text-3xl">Everything in one viewport</h2>
              </div>
              <div class="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-200">Angular 19</div>
            </div>
            <div class="mt-6 space-y-3">
              @for (route of spotlightRoutes; track route.title) {
                <a [routerLink]="route.path" class="block rounded-[1.5rem] border border-white/10 bg-white/5 p-4 transition hover:border-[#f7c66f]/50 hover:bg-white/10">
                  <div class="flex items-center justify-between gap-4">
                    <div>
                      <div class="text-sm uppercase tracking-[0.24em] text-slate-300">{{ route.kicker }}</div>
                      <div class="mt-1 text-xl font-semibold">{{ route.title }}</div>
                    </div>
                    <span class="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200">{{ route.badge }}</span>
                  </div>
                  <p class="mt-3 text-sm leading-6 text-slate-300">{{ route.description }}</p>
                </a>
              }
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            @for (module of moduleCards; track module.title) {
              <a [routerLink]="module.path" class="rounded-[1.75rem] border border-slate-200 bg-white/80 p-5 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.6)] transition hover:-translate-y-1 hover:border-[#f26b38]">
                <div class="text-xs uppercase tracking-[0.24em] text-slate-500">{{ module.kicker }}</div>
                <h3 class="mt-3 text-2xl font-semibold text-slate-950">{{ module.title }}</h3>
                <p class="mt-2 text-sm leading-6 text-slate-600">{{ module.description }}</p>
              </a>
            }
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="section-shell rounded-[2rem] p-6">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.3em] text-[#f26b38]">Route atlas</p>
            <h2 class="editorial-title mt-2 text-4xl text-slate-950">Every screen is one click away</h2>
          </div>
          <p class="max-w-2xl text-sm leading-7 text-slate-600">
            The old landing page hid most of the product behind raw routes. This grid makes each surface visible, including internal states like admin and checkout.
          </p>
        </div>

        <div class="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          @for (route of routeAtlas; track route.path) {
            <a [routerLink]="route.path" class="group rounded-[1.5rem] border border-slate-200 bg-[#fffdf9] p-5 transition hover:border-[#102a43] hover:bg-[#102a43] hover:text-white">
              <div class="flex items-start justify-between gap-3">
                <div class="text-xs uppercase tracking-[0.24em] text-slate-400 group-hover:text-slate-200">{{ route.kicker }}</div>
                <div class="rounded-full border border-slate-200 px-2 py-1 text-[10px] uppercase tracking-[0.24em] text-slate-500 group-hover:border-white/20 group-hover:text-slate-200">
                  {{ route.label }}
                </div>
              </div>
              <h3 class="mt-6 text-2xl font-semibold text-slate-950 group-hover:text-white">{{ route.title }}</h3>
              <p class="mt-3 text-sm leading-6 text-slate-600 group-hover:text-slate-200">{{ route.description }}</p>
            </a>
          }
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div class="section-shell-dark rounded-[2rem] p-8 text-white">
          <p class="eyebrow text-xs text-[#f7c66f]">Why it looks better now</p>
          <h2 class="editorial-title mt-3 text-4xl">A stronger visual system</h2>
          <ul class="mt-6 space-y-4 text-sm leading-7 text-slate-300">
            @for (item of principles; track item.title) {
              <li class="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                <div class="font-semibold text-white">{{ item.title }}</div>
                <div class="mt-1">{{ item.description }}</div>
              </li>
            }
          </ul>
        </div>

        <div class="grid gap-4 md:grid-cols-3">
          @for (family of componentFamilies; track family.title) {
            <div class="rounded-[1.75rem] border border-slate-200 bg-white/80 p-6">
              <div class="text-xs uppercase tracking-[0.24em] text-slate-400">{{ family.kicker }}</div>
              <h3 class="mt-4 text-2xl font-semibold text-slate-950">{{ family.title }}</h3>
              <p class="mt-3 text-sm leading-6 text-slate-600">{{ family.description }}</p>
              <div class="mt-6 flex flex-wrap gap-2">
                @for (tag of family.tags; track tag) {
                  <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{{ tag }}</span>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class LandingComponent {
  protected readonly stats = [
    { value: '8', label: 'Core routes surfaced' },
    { value: '3', label: 'Framework families' },
    { value: '1', label: 'Unified storefront' },
  ];

  protected readonly spotlightRoutes = [
    {
      kicker: 'Catalog',
      title: 'Browse component packs',
      description: 'Search, filter, and compare storefront inventory with a denser marketplace treatment.',
      path: '/catalog',
      badge: 'Shop',
    },
    {
      kicker: 'Checkout',
      title: 'Test the buying flow',
      description: 'Jump into cart and payment states without waiting for hidden links or dead-end placeholders.',
      path: '/checkout',
      badge: 'Flow',
    },
    {
      kicker: 'Admin',
      title: 'Inspect internal tools',
      description: 'The admin surface is discoverable from the first screen so operational pages stop feeling unfinished.',
      path: '/admin',
      badge: 'Ops',
    },
  ];

  protected readonly moduleCards = [
    {
      kicker: 'Customer area',
      title: 'Dashboard',
      description: 'See purchases, licenses, downloads, and account status in one place.',
      path: '/dashboard',
    },
    {
      kicker: 'Identity',
      title: 'Auth',
      description: 'Preview sign-in and account creation without drilling through buried navigation.',
      path: '/auth',
    },
  ];

  protected readonly routeAtlas = [
    { path: '/catalog', kicker: 'Market', label: 'Browse', title: 'Catalog', description: 'Search and filter product packs with richer product cards.' },
    { path: '/product/hero-sections', kicker: 'Preview', label: 'Inspect', title: 'Product Detail', description: 'A real product page with framework chips, pricing, and included assets.' },
    { path: '/cart', kicker: 'Basket', label: 'Review', title: 'Cart', description: 'Check selected products, quantities, and totals before checkout.' },
    { path: '/checkout', kicker: 'Purchase', label: 'Convert', title: 'Checkout', description: 'Move through payment and order summary states in the same polished language.' },
    { path: '/auth', kicker: 'Account', label: 'Access', title: 'Auth', description: 'Sign in or create an account with a cleaner editorial layout.' },
    { path: '/dashboard', kicker: 'Customer', label: 'Manage', title: 'Dashboard', description: 'Track purchases, licenses, and upcoming releases.' },
    { path: '/admin', kicker: 'Internal', label: 'Operate', title: 'Admin', description: 'Surface operational tooling instead of hiding it off-route.' },
    { path: '/', kicker: 'Entry', label: 'Start', title: 'Landing', description: 'Return to the overview and explore the whole storefront structure.' },
  ];

  protected readonly principles = [
    { title: 'Stronger typography', description: 'The page now uses a serif-led visual rhythm instead of default SaaS blocks.' },
    { title: 'Intentional backgrounds', description: 'Layered gradients and soft atmospheric color keep the app from reading as flat boilerplate.' },
    { title: 'Discoverable navigation', description: 'Core product surfaces are now promoted in both the header and the landing page.' },
  ];

  protected readonly componentFamilies = [
    {
      kicker: 'Editorial',
      title: 'Hero sections',
      description: 'High-contrast marketing blocks, feature stacks, pricing intros, and launch callouts.',
      tags: ['Marketing', 'Conversion', 'Launch'],
    },
    {
      kicker: 'Commerce',
      title: 'Storefront UI',
      description: 'Catalog cards, carts, checkout modules, dashboards, and transaction states for product-led flows.',
      tags: ['Catalog', 'Cart', 'Checkout'],
    },
    {
      kicker: 'Systems',
      title: 'Ops surfaces',
      description: 'Admin views, management dashboards, and internal utilities that still deserve design attention.',
      tags: ['Admin', 'Metrics', 'Internal'],
    },
  ];
}
