import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Product } from '../../core/models/product.model';
import { CartService, LicenseType } from '../../core/services/cart.service';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      @if (loading()) {
        <div class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div class="h-[32rem] rounded-[2rem] bg-white/70 animate-pulse"></div>
          <div class="h-[24rem] rounded-[2rem] bg-white/70 animate-pulse"></div>
        </div>
      } @else if (error()) {
        <div class="section-shell rounded-[2rem] p-10 text-center">
          <div class="text-xs uppercase tracking-[0.24em] text-[#f26b38]">Product unavailable</div>
          <h1 class="editorial-title mt-4 text-4xl text-slate-950">We couldn’t load this component pack.</h1>
          <p class="mt-4 text-sm leading-7 text-slate-600">{{ error() }}</p>
          <a routerLink="/catalog" class="brand-button mt-6 inline-flex rounded-full px-5 py-3 text-sm font-semibold transition">
            Return to catalog
          </a>
        </div>
      } @else if (product()) {
        <div class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div class="section-shell rounded-[2rem] p-8">
            <div class="flex flex-wrap items-center gap-3">
              <span class="rounded-full bg-[#102a43] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white">
                {{ product()?.category }}
              </span>
              @for (tag of frameworks(); track tag) {
                <span class="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                  {{ tag }}
                </span>
              }
            </div>

            <h1 class="editorial-title mt-6 text-5xl leading-none text-slate-950">{{ product()?.name }}</h1>
            <p class="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{{ product()?.description }}</p>

            <div class="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                (click)="buyNow()"
                class="accent-button rounded-full px-6 py-3 text-sm font-semibold transition"
              >
                Buy {{ selectedLicense() === 'team' ? 'studio' : 'single' }} for \${{ selectedPrice() }}
              </button>
              <button
                type="button"
                (click)="addToCart()"
                class="secondary-button rounded-full px-6 py-3 text-sm font-semibold transition"
              >
                Add to cart
              </button>
              <a routerLink="/catalog" class="secondary-button rounded-full px-6 py-3 text-sm font-semibold transition">
                Back to catalog
              </a>
            </div>

            <div class="mt-10 grid gap-4 md:grid-cols-3">
              @for (highlight of highlights(); track highlight.label) {
                <div class="metric-card rounded-[1.5rem] p-5">
                  <div class="text-2xl font-semibold text-slate-950">{{ highlight.value }}</div>
                  <div class="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">{{ highlight.label }}</div>
                </div>
              }
            </div>

            <div class="mt-10 overflow-hidden rounded-[1.75rem] border border-slate-200">
              <div class="relative h-80 p-6 text-white" [style.background]="accent()">
                <div class="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/20"></div>
                <div class="relative flex h-full items-end justify-between gap-6">
                  <div class="max-w-lg">
                    <div class="text-xs uppercase tracking-[0.24em] text-white/75">Component preview</div>
                    <div class="mt-3 text-3xl font-semibold">{{ product()?.name }}</div>
                    <p class="mt-4 text-sm leading-6 text-white/85">
                      Built for premium storefronts, internal tools, and fast-moving product teams.
                    </p>
                  </div>
                  <img
                    [src]="product()?.previewImageUrl"
                    [alt]="product()?.name"
                    class="hidden h-52 w-72 rounded-[1.5rem] border border-white/20 object-cover shadow-[0_25px_60px_-25px_rgba(15,23,42,0.6)] md:block"
                  />
                </div>
              </div>
            </div>

            <div class="mt-10 grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
              <div class="soft-card rounded-[1.5rem] p-6">
                <div class="text-xs uppercase tracking-[0.24em] text-slate-500">Included</div>
                <ul class="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                  @for (item of product()?.features ?? []; track item) {
                    <li class="flex gap-3">
                      <span class="mt-1 h-2.5 w-2.5 rounded-full bg-[#f26b38]"></span>
                      <span>{{ item }}</span>
                    </li>
                  }
                </ul>
              </div>

              <div class="section-shell rounded-[1.5rem] p-6">
                <div class="text-xs uppercase tracking-[0.24em] text-slate-500">Why teams buy this pack</div>
                <div class="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                  <p>Production-ready Tailwind CSS markup with an Angular-first storefront in mind.</p>
                  <p>Clear single-project and studio pricing, plus instant file delivery after payment.</p>
                  <p>Download access flows straight into the customer dashboard so licenses stay discoverable.</p>
                </div>
              </div>
            </div>
          </div>

          <aside class="space-y-6">
            <div class="section-shell-dark rounded-[2rem] p-7 text-white">
              <div class="eyebrow text-xs text-[#f7c66f]">Licensing</div>
              <div class="mt-5 grid gap-4">
                <button
                  type="button"
                  (click)="selectedLicense.set('single')"
                  class="rounded-[1.5rem] border p-5 text-left transition"
                  [ngClass]="selectedLicense() === 'single' ? 'border-[#f7c66f] bg-white/10' : 'border-white/10 bg-white/5'"
                >
                  <div class="text-xs uppercase tracking-[0.24em] text-slate-300">Single project</div>
                  <div class="mt-2 text-4xl font-semibold">\${{ product()?.price }}</div>
                  <div class="mt-2 text-sm text-slate-300">One team, one shipped product, lifetime updates.</div>
                </button>
                <button
                  type="button"
                  (click)="selectedLicense.set('team')"
                  class="rounded-[1.5rem] border p-5 text-left transition"
                  [ngClass]="selectedLicense() === 'team' ? 'border-[#f7c66f] bg-white/10' : 'border-white/10 bg-white/5'"
                >
                  <div class="text-xs uppercase tracking-[0.24em] text-slate-300">Studio license</div>
                  <div class="mt-2 text-4xl font-semibold">\${{ product()?.teamPrice }}</div>
                  <div class="mt-2 text-sm text-slate-300">Unlimited internal builds, client work, and priority drops.</div>
                </button>
              </div>
            </div>

            <div class="section-shell rounded-[2rem] p-7">
              <div class="text-xs uppercase tracking-[0.26em] text-slate-500">Related packs</div>
              <div class="mt-5 grid gap-3">
                @for (related of relatedProducts(); track related.id) {
                  <a
                    [routerLink]="['/product', related.slug]"
                    class="rounded-[1.25rem] border border-slate-200 px-4 py-4 transition hover:border-[#f26b38] hover:bg-[#fff8ee]"
                  >
                    <div class="text-lg font-semibold text-slate-950">{{ related.name }}</div>
                    <div class="mt-1 text-sm text-slate-600">{{ related.description }}</div>
                  </a>
                }
              </div>
            </div>
          </aside>
        </div>
      }
    </section>
  `
})
export class ProductDetailComponent {
  private readonly api = inject(ApiService);
  private readonly cart = inject(CartService);
  private readonly router = inject(Router);

  slug = input<string>();
  protected readonly product = signal<Product | null>(null);
  protected readonly relatedProducts = signal<Product[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly selectedLicense = signal<LicenseType>('single');

  protected readonly frameworks = computed(() => {
    const category = this.product()?.category ?? '';
    return this.frameworkMap[category] ?? ['Angular', 'Tailwind CSS', 'Design system'];
  });

  protected readonly selectedPrice = computed(() =>
    this.selectedLicense() === 'team' ? this.product()?.teamPrice ?? 0 : this.product()?.price ?? 0
  );

  protected readonly accent = computed(() =>
    this.accentByCategory(this.product()?.category ?? 'TailwindVault')
  );

  protected readonly highlights = computed(() => {
    const currentProduct = this.product();
    if (!currentProduct) {
      return [];
    }

    return [
      { label: 'Category', value: currentProduct.category },
      { label: 'Features', value: String(currentProduct.features.length) },
      { label: 'License tiers', value: '2' }
    ];
  });

  constructor() {
    effect(
      () => {
        const currentSlug = this.slug() ?? 'ecommerce-navbar-pro';
        void this.loadProduct(currentSlug);
      },
      { allowSignalWrites: true }
    );
  }

  async addToCart(): Promise<void> {
    const currentProduct = this.product();
    if (!currentProduct) {
      return;
    }

    this.cart.addItem({
      productId: Number(currentProduct.id),
      slug: currentProduct.slug,
      name: currentProduct.name,
      previewImageUrl: currentProduct.previewImageUrl,
      licenseType: this.selectedLicense(),
      price: this.selectedLicense() === 'team' ? currentProduct.teamPrice : currentProduct.price
    });
  }

  async buyNow(): Promise<void> {
    await this.addToCart();
    await this.router.navigate(['/checkout']);
  }

  private async loadProduct(slug: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const currentProduct = await firstValueFrom(this.api.getProductBySlug(slug));
      this.product.set(currentProduct);

      const related = await firstValueFrom(this.api.getProductsByCategory(currentProduct.category));
      this.relatedProducts.set(
        related.filter((product) => product.slug !== currentProduct.slug).slice(0, 3)
      );
    } catch {
      this.error.set('The product may have moved or the API is currently unavailable.');
      this.product.set(null);
      this.relatedProducts.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  private accentByCategory(category: string): string {
    return (
      this.categoryAccentMap[category] ??
      'linear-gradient(135deg, #102a43 0%, #1f4f78 100%)'
    );
  }

  private readonly frameworkMap: Record<string, string[]> = {
    Navigation: ['Angular', 'Tailwind CSS', 'Marketplace'],
    Pricing: ['Angular', 'Tailwind CSS', 'Conversion'],
    Forms: ['Angular', 'Tailwind CSS', 'Validation'],
    Dashboard: ['Angular', 'Tailwind CSS', 'Analytics'],
    Hero: ['Angular', 'Tailwind CSS', 'Marketing'],
    Checkout: ['Angular', 'Tailwind CSS', 'Stripe-ready'],
    Settings: ['Angular', 'Tailwind CSS', 'Account'],
    Marketing: ['Angular', 'Tailwind CSS', 'Editorial'],
    Admin: ['Angular', 'Tailwind CSS', 'Operations'],
    Auth: ['Angular', 'Tailwind CSS', 'Identity']
  };

  private readonly categoryAccentMap: Record<string, string> = {
    Navigation: 'linear-gradient(135deg, #102a43 0%, #1f4f78 100%)',
    Pricing: 'linear-gradient(135deg, #3f3cbb 0%, #6a60ff 100%)',
    Forms: 'linear-gradient(135deg, #3b1f2b 0%, #a445b2 100%)',
    Dashboard: 'linear-gradient(135deg, #16324f 0%, #4c7b8c 100%)',
    Hero: 'linear-gradient(135deg, #7c2d12 0%, #f26b38 100%)',
    Checkout: 'linear-gradient(135deg, #7c2d12 0%, #f26b38 100%)',
    Settings: 'linear-gradient(135deg, #203a43 0%, #2c5364 100%)',
    Marketing: 'linear-gradient(135deg, #8c5a12 0%, #f7c66f 100%)',
    Admin: 'linear-gradient(135deg, #203a43 0%, #2c5364 100%)',
    Auth: 'linear-gradient(135deg, #102a43 0%, #1f4f78 100%)'
  };
}
