import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Product } from '../../core/models/product.model';
import { ApiService } from '../../core/services/api.service';

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
            <a [routerLink]="['/product', featuredProducts().length > 0 ? featuredProducts()[0].slug : 'ecommerce-navbar-pro']" class="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-[#f26b38] hover:text-[#102a43]">
              Open a product page
            </a>
          </div>

          <div class="grid gap-4 sm:grid-cols-3">
            @for (stat of stats(); track stat.label) {
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
                <h2 class="editorial-title mt-2 text-3xl">Fresh from the API</h2>
              </div>
              <div class="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-200">Angular 19 + Nest</div>
            </div>
            <div class="mt-6 space-y-3">
              @for (product of featuredProducts().slice(0, 3); track product.id) {
                <a [routerLink]="['/product', product.slug]" class="block rounded-[1.5rem] border border-white/10 bg-white/5 p-4 transition hover:border-[#f7c66f]/50 hover:bg-white/10">
                  <div class="flex items-center justify-between gap-4">
                    <div>
                      <div class="text-sm uppercase tracking-[0.24em] text-slate-300">{{ product.category }}</div>
                      <div class="mt-1 text-xl font-semibold">{{ product.name }}</div>
                    </div>
                    <span class="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200">\${{ product.price }}</span>
                  </div>
                  <p class="mt-3 text-sm leading-6 text-slate-300">{{ product.description }}</p>
                </a>
              }
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            @for (category of categoryCards().slice(0, 2); track category.name) {
              <a routerLink="/catalog" class="rounded-[1.75rem] border border-slate-200 bg-white/80 p-5 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.6)] transition hover:-translate-y-1 hover:border-[#f26b38]">
                <div class="text-xs uppercase tracking-[0.24em] text-slate-500">{{ category.kicker }}</div>
                <h3 class="mt-3 text-2xl font-semibold text-slate-950">{{ category.name }}</h3>
                <p class="mt-2 text-sm leading-6 text-slate-600">{{ category.description }}</p>
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
            <p class="text-xs uppercase tracking-[0.3em] text-[#f26b38]">Featured components</p>
            <h2 class="editorial-title mt-2 text-4xl text-slate-950">Premium packs seeded from the marketplace API</h2>
          </div>
          <p class="max-w-2xl text-sm leading-7 text-slate-600">
            TailwindVault starts with curated storefront inventory: navigation, checkout, dashboards, pricing, admin, and auth flows ready to inspect.
          </p>
        </div>

        <div class="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          @for (product of featuredProducts(); track product.id) {
            <a [routerLink]="['/product', product.slug]" class="group overflow-hidden rounded-[1.5rem] border border-slate-200 bg-[#fffdf9] p-5 transition hover:border-[#102a43] hover:bg-[#102a43] hover:text-white">
              <img [src]="product.previewImageUrl" [alt]="product.name" class="h-40 w-full rounded-[1.25rem] object-cover" />
              <div class="mt-4 flex items-start justify-between gap-3">
                <div class="text-xs uppercase tracking-[0.24em] text-slate-400 group-hover:text-slate-200">{{ product.category }}</div>
                <div class="rounded-full border border-slate-200 px-2 py-1 text-[10px] uppercase tracking-[0.24em] text-slate-500 group-hover:border-white/20 group-hover:text-slate-200">
                  \${{ product.price }}
                </div>
              </div>
              <h3 class="mt-4 text-2xl font-semibold text-slate-950 group-hover:text-white">{{ product.name }}</h3>
              <p class="mt-3 text-sm leading-6 text-slate-600 group-hover:text-slate-200">{{ product.description }}</p>
            </a>
          }
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div class="section-shell-dark rounded-[2rem] p-8 text-white">
          <p class="eyebrow text-xs text-[#f7c66f]">Browse by category</p>
          <h2 class="editorial-title mt-3 text-4xl">Marketplace inventory that already feels merchandised</h2>
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
          @for (family of categoryCards(); track family.name) {
            <div class="rounded-[1.75rem] border border-slate-200 bg-white/80 p-6">
              <div class="text-xs uppercase tracking-[0.24em] text-slate-400">{{ family.kicker }}</div>
              <h3 class="mt-4 text-2xl font-semibold text-slate-950">{{ family.name }}</h3>
              <p class="mt-3 text-sm leading-6 text-slate-600">{{ family.description }}</p>
              <div class="mt-6 text-sm font-semibold text-[#102a43]">{{ family.count }} live pack{{ family.count === 1 ? '' : 's' }}</div>
            </div>
          }
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="section-shell-dark rounded-[2rem] px-8 py-10 text-white">
        <div class="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div class="eyebrow text-xs text-[#f7c66f]">Start building</div>
            <h2 class="editorial-title mt-3 text-4xl">Jump from discovery into purchase and download without leaving the MVP.</h2>
            <p class="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Browse the catalog, inspect a pack, test checkout, sign in, and land in the dashboard with generated licenses.
            </p>
          </div>
          <div class="flex flex-wrap gap-3">
            <a routerLink="/catalog" class="accent-button rounded-full px-6 py-3 text-sm font-semibold transition">Explore packs</a>
            <a routerLink="/auth" class="secondary-button rounded-full px-6 py-3 text-sm font-semibold transition">Open account area</a>
          </div>
        </div>
      </div>
    </section>
  `
})
export class LandingComponent implements OnInit {
  private readonly api = inject(ApiService);
  protected readonly products = signal<Product[]>([]);

  protected readonly featuredProducts = computed(() => this.products().slice(0, 4));
  protected readonly stats = computed(() => [
    { value: String(this.products().length || 0).padStart(2, '0'), label: 'Live marketplace packs' },
    { value: String(this.categoryCards().length || 0).padStart(2, '0'), label: 'Merchandised categories' },
    {
      value: this.products().length
        ? `\$${Math.round(this.products().reduce((sum, product) => sum + product.price, 0) / this.products().length)}`
        : '\$0',
      label: 'Average single-seat price'
    }
  ]);

  protected readonly categoryCards = computed(() => {
    const categoryMap = new Map<string, number>();
    for (const product of this.products()) {
      categoryMap.set(product.category, (categoryMap.get(product.category) ?? 0) + 1);
    }

    return Array.from(categoryMap.entries()).map(([name, count]) => ({
      name,
      count,
      kicker: count > 1 ? 'Collection' : 'Featured pack',
      description: `${count} curated pack${count === 1 ? '' : 's'} currently visible in the marketplace.`
    }));
  });

  protected readonly principles = [
    { title: 'API-backed merchandising', description: 'The landing page now reflects real inventory instead of placeholder route cards.' },
    { title: 'Category clarity', description: 'Visitors can see the major component families before they dive into the catalog.' },
    { title: 'Commerce continuity', description: 'Discovery, checkout, and account flows are presented as one connected product.' },
  ];

  async ngOnInit(): Promise<void> {
    try {
      const response = await firstValueFrom(this.api.getProducts({ page: 1, limit: 8 }));
      this.products.set(response.products);
    } catch {
      this.products.set([]);
    }
  }
}
