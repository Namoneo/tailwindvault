import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Product } from '../../core/services/api.service';

type DemoProduct = Product & {
  mood: string;
  categoryId: string;
  framework: string[];
  accent: string;
};

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="section-shell rounded-[2rem] p-8">
        <div class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div class="max-w-3xl">
            <p class="eyebrow text-xs text-[#f26b38]">Catalog</p>
            <h1 class="editorial-title mt-3 text-5xl leading-none text-slate-950">Browse the vault by mood, use case, and framework.</h1>
            <p class="mt-4 text-base leading-7 text-slate-600">
              The marketplace now keeps showing meaningful inventory even when the API is empty, so you can inspect the design language instead of staring at a blank grid.
            </p>
          </div>

          <div class="grid gap-3 sm:grid-cols-3">
            @for (metric of metrics; track metric.label) {
              <div class="metric-card rounded-[1.5rem] px-5 py-4">
                <div class="text-2xl font-semibold text-slate-950">{{ metric.value }}</div>
                <div class="text-xs uppercase tracking-[0.24em] text-slate-500">{{ metric.label }}</div>
              </div>
            }
          </div>
        </div>

        <div class="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div class="soft-card rounded-[1.75rem] p-6">
            <label class="eyebrow text-xs text-slate-500">Search the library</label>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (ngModelChange)="search()"
              placeholder="Hero, checkout, dashboard, pricing..."
              class="input-shell mt-3 w-full rounded-2xl px-4 py-4 text-slate-900 transition"
            />

            <div class="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                (click)="filterByCategory(null)"
                class="route-chip rounded-full px-4 py-2 text-sm font-medium transition"
                [class.bg-[#102a43]]="activeCategory() === null"
                [class.text-white]="activeCategory() === null"
                [class.bg-slate-100]="activeCategory() !== null"
                [class.text-slate-700]="activeCategory() !== null"
              >
                All collections
              </button>

              @for (cat of categories(); track cat.id) {
                <button
                  type="button"
                  (click)="filterByCategory(cat.id)"
                  class="route-chip rounded-full px-4 py-2 text-sm font-medium transition"
                  [class.bg-[#102a43]]="activeCategory() === cat.id"
                  [class.text-white]="activeCategory() === cat.id"
                  [class.bg-slate-100]="activeCategory() !== cat.id"
                  [class.text-slate-700]="activeCategory() !== cat.id"
                >
                  {{ cat.name }}
                </button>
              }
            </div>
          </div>

          <div class="grid gap-3 sm:grid-cols-3">
            @for (lane of curationLanes; track lane.title) {
              <div class="soft-card rounded-[1.5rem] p-5">
                <div class="eyebrow text-[11px] text-slate-400">{{ lane.kicker }}</div>
                <div class="mt-3 text-xl font-semibold text-slate-950">{{ lane.title }}</div>
                <p class="mt-2 text-sm leading-6 text-slate-600">{{ lane.description }}</p>
              </div>
            }
          </div>
        </div>
      </div>

      @if (loading()) {
        <div class="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          @for (i of [1, 2, 3, 4, 5, 6]; track i) {
            <div class="h-80 rounded-[1.75rem] bg-white/70 animate-pulse"></div>
          }
        </div>
      } @else {
        <div class="mt-8 flex items-center justify-between">
          <div class="text-sm uppercase tracking-[0.24em] text-slate-500">
            {{ visibleProducts().length }} packs visible
          </div>
          @if (usingFallback()) {
            <div class="rounded-full border border-[#f7c66f] bg-[#fff8e8] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#8c5a12]">
              Demo curation active
            </div>
          }
        </div>

        <div class="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          @for (product of visibleProducts(); track product.id) {
            <a [routerLink]="['/product', product.slug]" class="section-shell group rounded-[1.9rem] p-5 transition hover:-translate-y-1.5 hover:border-[#102a43]">
              <div class="flex items-center justify-between gap-4">
                <div class="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white" [style.background]="product.accent">
                  {{ product.mood }}
                </div>
                <div class="text-xs uppercase tracking-[0.24em] text-slate-400">{{ product.framework.join(' / ') }}</div>
              </div>

              <div class="mt-5 rounded-[1.5rem] p-5 text-white" [style.background]="product.accent">
                <div class="text-xs uppercase tracking-[0.24em] text-white/75">Featured pack</div>
                <div class="mt-10 flex items-end justify-between">
                  <div>
                    <div class="max-w-[12rem] text-3xl font-semibold leading-tight">{{ product.name }}</div>
                    <div class="mt-2 text-sm text-white/80">Production-ready patterns with polished states.</div>
                  </div>
                  <div class="grid gap-2">
                    <div class="h-3 w-16 rounded-full bg-white/25"></div>
                    <div class="h-3 w-10 rounded-full bg-white/15"></div>
                    <div class="h-16 w-20 rounded-2xl bg-white/10"></div>
                  </div>
                </div>
              </div>

              <div class="mt-5">
                <h3 class="text-2xl font-semibold text-slate-950">{{ product.name }}</h3>
                <p class="mt-3 min-h-16 text-sm leading-6 text-slate-600">{{ product.description }}</p>
              </div>

              <div class="mt-5 flex items-center justify-between">
                <div>
                  <div class="text-xs uppercase tracking-[0.24em] text-slate-400">Single seat</div>
                  <div class="text-2xl font-semibold text-slate-950">\${{ product.price }}</div>
                </div>
                <div class="text-right">
                  <div class="text-xs uppercase tracking-[0.24em] text-slate-400">Team license</div>
                  <div class="text-lg font-semibold text-slate-700">\${{ product.teamPrice }}</div>
                </div>
              </div>
            </a>
          }
        </div>
      }
    </section>
  `
})
export class CatalogComponent implements OnInit {
  private api = inject(ApiService);

  products = signal<Product[]>([]);
  categories = signal<{ id: string; name: string }[]>([]);
  loading = signal(true);
  searchQuery = '';
  activeCategory = signal<string | null>(null);
  usingFallback = signal(false);

  protected readonly metrics = [
    { value: '42+', label: 'marketplace packs' },
    { value: '3', label: 'framework outputs' },
    { value: '100%', label: 'surface visibility' },
  ];

  protected readonly curationLanes = [
    { kicker: 'Editorial', title: 'Hero systems', description: 'Narrative sections, launch blocks, and premium landing modules.' },
    { kicker: 'Commerce', title: 'Selling flows', description: 'Catalog cards, checkout stacks, carts, and conversion states.' },
    { kicker: 'Operations', title: 'Internal UI', description: 'Dashboards and admin patterns that avoid generic back-office styling.' },
  ];

  private readonly demoProducts: DemoProduct[] = [
    { id: 'demo-1', slug: 'hero-sections', name: 'Hero Sections', description: 'Bold landing page intros, editorial split-heroes, and conversion-first callouts.', price: 59, teamPrice: 149, mood: 'Cinematic', categoryId: 'heroes', framework: ['Angular', 'React', 'Vue'], accent: 'linear-gradient(135deg, #102a43 0%, #1f4f78 100%)' },
    { id: 'demo-2', slug: 'dashboard-chrome', name: 'Dashboard Chrome', description: 'Metric bands, dense data cards, and polished account surfaces for SaaS products.', price: 79, teamPrice: 189, mood: 'Operational', categoryId: 'dashboard', framework: ['Angular', 'React'], accent: 'linear-gradient(135deg, #16324f 0%, #4c7b8c 100%)' },
    { id: 'demo-3', slug: 'checkout-flow', name: 'Checkout Flow', description: 'Payment, cart, receipt, and upsell modules tuned for digital products.', price: 69, teamPrice: 169, mood: 'Commerce', categoryId: 'commerce', framework: ['Angular', 'Vue'], accent: 'linear-gradient(135deg, #7c2d12 0%, #f26b38 100%)' },
    { id: 'demo-4', slug: 'pricing-stories', name: 'Pricing Stories', description: 'Editorial pricing tables with social proof, FAQs, and upgrade states.', price: 49, teamPrice: 129, mood: 'Conversion', categoryId: 'commerce', framework: ['React', 'Vue'], accent: 'linear-gradient(135deg, #3f3cbb 0%, #6a60ff 100%)' },
    { id: 'demo-5', slug: 'admin-panels', name: 'Admin Panels', description: 'Operational tooling with filters, moderation patterns, and audit-ready layouts.', price: 89, teamPrice: 219, mood: 'Control', categoryId: 'dashboard', framework: ['Angular', 'React'], accent: 'linear-gradient(135deg, #203a43 0%, #2c5364 100%)' },
    { id: 'demo-6', slug: 'account-settings', name: 'Account Settings', description: 'Profile, billing, and license management screens with a premium tone.', price: 39, teamPrice: 109, mood: 'Utility', categoryId: 'dashboard', framework: ['Angular', 'React', 'Vue'], accent: 'linear-gradient(135deg, #3b1f2b 0%, #a445b2 100%)' },
  ];

  protected readonly visibleProducts = computed(() => {
    const source = this.usingFallback() ? this.demoProducts : this.products().map((product) => this.decorateProduct(product));
    const query = this.searchQuery.trim().toLowerCase();
    const cat = this.activeCategory();
    return source.filter((product) => {
      const matchesQuery = !query || `${product.name} ${product.description ?? ''}`.toLowerCase().includes(query);
      const matchesCat = !cat || (product as any).categoryId === cat;
      return matchesQuery && matchesCat;
    });
  });

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.loading.set(true);
    const params: Record<string, string | number> = { page: 1, limit: 12 };
    if (this.activeCategory()) params['categoryId'] = this.activeCategory()!;
    if (this.searchQuery) params['search'] = this.searchQuery;

    this.api.getProducts(params).subscribe({
      next: (res) => {
        this.products.set(res.products);
        this.usingFallback.set(res.products.length === 0);
        this.loading.set(false);
      },
      error: () => {
        this.products.set([]);
        this.usingFallback.set(true);
        this.loading.set(false);
      }
    });
  }

  loadCategories() {
    this.api.getCategories().subscribe({
      next: (cats) => this.categories.set(cats),
      error: () => this.categories.set([
        { id: 'heroes', name: 'Heroes' },
        { id: 'commerce', name: 'Commerce' },
        { id: 'dashboard', name: 'Dashboards' },
      ]),
    });
  }

  search() {
    if (!this.usingFallback()) {
      this.loadProducts();
    }
  }

  filterByCategory(catId: string | null) {
    this.activeCategory.set(this.activeCategory() === catId ? null : catId);
    if (!this.usingFallback()) {
      this.loadProducts();
    }
  }

  private decorateProduct(product: Product): DemoProduct {
    const fallback = this.demoProducts.find((item) => item.slug === product.slug) ?? this.demoProducts[0];
    return {
      ...product,
      mood: fallback.mood,
      framework: fallback.framework,
      accent: fallback.accent,
      teamPrice: product.teamPrice || product.price * 2,
    };
  }
}
