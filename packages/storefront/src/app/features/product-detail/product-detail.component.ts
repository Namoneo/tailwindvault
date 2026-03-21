import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div class="section-shell rounded-[2rem] p-8">
          <div class="flex flex-wrap items-center gap-3">
            <span class="rounded-full bg-[#102a43] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white">{{ product().kicker }}</span>
            @for (tag of product().frameworks; track tag) {
              <span class="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">{{ tag }}</span>
            }
          </div>

          <h1 class="editorial-title mt-6 text-5xl leading-none text-slate-950">{{ product().title }}</h1>
          <p class="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{{ product().description }}</p>

          <div class="mt-8 flex flex-wrap gap-3">
            <a routerLink="/checkout" class="accent-button rounded-full px-6 py-3 text-sm font-semibold transition">
              Buy for \${{ product().singlePrice }}
            </a>
            <a routerLink="/catalog" class="secondary-button rounded-full px-6 py-3 text-sm font-semibold transition">
              Back to catalog
            </a>
          </div>

          <div class="mt-10 grid gap-4 md:grid-cols-3">
            @for (highlight of product().highlights; track highlight.label) {
              <div class="metric-card rounded-[1.5rem] p-5">
                <div class="text-2xl font-semibold text-slate-950">{{ highlight.value }}</div>
                <div class="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">{{ highlight.label }}</div>
              </div>
            }
          </div>

          <div class="mt-10 rounded-[1.75rem] p-6 text-white" [style.background]="product().accent">
            <div class="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
              <div>
                <div class="text-xs uppercase tracking-[0.24em] text-white/70">Preview layout</div>
                <div class="mt-4 space-y-3">
                  <div class="h-4 w-24 rounded-full bg-white/30"></div>
                  <div class="h-10 max-w-sm rounded-2xl bg-white/25"></div>
                  <div class="h-3 w-full max-w-md rounded-full bg-white/20"></div>
                  <div class="h-3 w-4/5 rounded-full bg-white/15"></div>
                  <div class="mt-6 grid grid-cols-3 gap-3">
                    <div class="h-24 rounded-2xl bg-white/15"></div>
                    <div class="h-24 rounded-2xl bg-white/10"></div>
                    <div class="h-24 rounded-2xl bg-white/20"></div>
                  </div>
                </div>
              </div>

              <div class="rounded-[1.5rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
                <div class="text-xs uppercase tracking-[0.24em] text-white/70">Included</div>
                <ul class="mt-4 space-y-3 text-sm leading-6 text-white/90">
                  @for (item of product().included; track item) {
                    <li class="flex gap-3">
                      <span class="mt-1 h-2.5 w-2.5 rounded-full bg-[#f7c66f]"></span>
                      <span>{{ item }}</span>
                    </li>
                  }
                </ul>
              </div>
            </div>
          </div>
        </div>

        <aside class="space-y-6">
          <div class="section-shell-dark rounded-[2rem] p-7 text-white">
            <div class="eyebrow text-xs text-[#f7c66f]">Licensing</div>
            <div class="mt-5 grid gap-4">
              <div class="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <div class="text-xs uppercase tracking-[0.24em] text-slate-300">Single project</div>
                <div class="mt-2 text-4xl font-semibold">\${{ product().singlePrice }}</div>
                <div class="mt-2 text-sm text-slate-300">One team, one shipped product, lifetime updates.</div>
              </div>
              <div class="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <div class="text-xs uppercase tracking-[0.24em] text-slate-300">Studio license</div>
                <div class="mt-2 text-4xl font-semibold">\${{ product().teamPrice }}</div>
                <div class="mt-2 text-sm text-slate-300">Unlimited internal builds, client work, and priority drops.</div>
              </div>
            </div>
          </div>

          <div class="section-shell rounded-[2rem] p-7">
            <div class="text-xs uppercase tracking-[0.26em] text-slate-500">Works well with</div>
            <div class="mt-5 grid gap-3">
              @for (related of product().related; track related.path) {
                <a [routerLink]="related.path" class="rounded-[1.25rem] border border-slate-200 px-4 py-4 transition hover:border-[#f26b38] hover:bg-[#fff8ee]">
                  <div class="text-lg font-semibold text-slate-950">{{ related.title }}</div>
                  <div class="mt-1 text-sm text-slate-600">{{ related.description }}</div>
                </a>
              }
            </div>
          </div>
        </aside>
      </div>
    </section>
  `
})
export class ProductDetailComponent {
  slug = input<string>();

  protected readonly product = computed(() => {
    const key = this.slug() ?? 'hero-sections';
    return this.productMap[key] ?? this.productMap['hero-sections'];
  });

  private readonly productMap: Record<string, {
    title: string;
    kicker: string;
    description: string;
    singlePrice: number;
    teamPrice: number;
    frameworks: string[];
    accent: string;
    highlights: { label: string; value: string }[];
    included: string[];
    related: { title: string; description: string; path: string }[];
  }> = {
    'hero-sections': {
      title: 'Hero Sections',
      kicker: 'Editorial landing pack',
      description: 'A premium set of launch heroes, split layouts, editorial feature bands, and call-to-action blocks for product marketing pages.',
      singlePrice: 59,
      teamPrice: 149,
      frameworks: ['Angular', 'React', 'Vue'],
      accent: 'linear-gradient(135deg, #102a43 0%, #1f4f78 100%)',
      highlights: [
        { label: 'Layouts', value: '18' },
        { label: 'Color stories', value: '6' },
        { label: 'Framework outputs', value: '3' },
      ],
      included: [
        'Responsive hero variants with layered artwork zones',
        'Feature strips, social proof rails, and CTA modules',
        'Production-ready Tailwind markup adapted for three frameworks',
      ],
      related: [
        { title: 'Catalog', description: 'Browse the rest of the vault.', path: '/catalog' },
        { title: 'Checkout Flow', description: 'See how products convert downstream.', path: '/product/checkout-flow' },
      ],
    },
    'checkout-flow': {
      title: 'Checkout Flow',
      kicker: 'Commerce conversion pack',
      description: 'Optimized cart, payment, receipt, and upgrade screens for digital product storefronts that need clearer conversion paths.',
      singlePrice: 69,
      teamPrice: 169,
      frameworks: ['Angular', 'Vue'],
      accent: 'linear-gradient(135deg, #7c2d12 0%, #f26b38 100%)',
      highlights: [
        { label: 'Templates', value: '12' },
        { label: 'States', value: '9' },
        { label: 'Upsell patterns', value: '4' },
      ],
      included: [
        'Cart, checkout, confirmation, and receipt templates',
        'Trust badges, order summaries, and recovery states',
        'Pricing and upsell variations for digital product bundles',
      ],
      related: [
        { title: 'Cart', description: 'Open the basket experience.', path: '/cart' },
        { title: 'Checkout', description: 'Walk through the live checkout route.', path: '/checkout' },
      ],
    },
  };
}
