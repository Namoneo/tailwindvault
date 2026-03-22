import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom, forkJoin } from 'rxjs';
import { OrderSummary } from '../../core/models/order.model';
import { Product } from '../../core/models/product.model';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="section-shell rounded-[2rem] p-8">
        <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="eyebrow text-xs text-[#f26b38]">Internal operations</p>
            <h1 class="editorial-title mt-3 text-5xl leading-none text-slate-950">Admin control room</h1>
            <p class="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Manage the live marketplace inventory and keep an eye on incoming orders without leaving the storefront shell.
            </p>
          </div>
          <div class="section-shell-dark rounded-[1.5rem] px-5 py-4 text-white">
            <div class="text-xs uppercase tracking-[0.24em] text-[#f7c66f]">Ops health</div>
            <div class="mt-2 text-3xl font-semibold">{{ loading() ? 'Syncing' : 'Live' }}</div>
          </div>
        </div>

        <div class="mt-8 grid gap-4 lg:grid-cols-3">
          @for (queue of queues(); track queue.title) {
              <div class="soft-card rounded-[1.5rem] p-5">
              <div class="text-xs uppercase tracking-[0.24em] text-slate-400">{{ queue.kicker }}</div>
              <h2 class="mt-3 text-2xl font-semibold text-slate-950">{{ queue.title }}</h2>
              <div class="mt-4 text-4xl font-semibold text-[#102a43]">{{ queue.value }}</div>
              <p class="mt-3 text-sm leading-6 text-slate-600">{{ queue.description }}</p>
            </div>
          }
        </div>

        <div class="mt-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div class="section-shell-dark rounded-[1.75rem] p-6 text-white">
            <div class="eyebrow text-xs text-[#f7c66f]">{{ editingProductId() ? 'Edit product' : 'Create product' }}</div>
            <form class="mt-5 space-y-4" (ngSubmit)="saveProduct()">
              <div>
                <label class="text-xs uppercase tracking-[0.24em] text-slate-300">Name</label>
                <input [(ngModel)]="form.name" name="name" class="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-slate-400" />
              </div>
              <div class="grid gap-4 md:grid-cols-2">
                <div>
                  <label class="text-xs uppercase tracking-[0.24em] text-slate-300">Slug</label>
                  <input [(ngModel)]="form.slug" name="slug" class="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-slate-400" />
                </div>
                <div>
                  <label class="text-xs uppercase tracking-[0.24em] text-slate-300">Category</label>
                  <input [(ngModel)]="form.category" name="category" class="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-slate-400" />
                </div>
              </div>
              <div>
                <label class="text-xs uppercase tracking-[0.24em] text-slate-300">Description</label>
                <textarea [(ngModel)]="form.description" name="description" rows="4" class="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-slate-400"></textarea>
              </div>
              <div class="grid gap-4 md:grid-cols-2">
                <div>
                  <label class="text-xs uppercase tracking-[0.24em] text-slate-300">Single price</label>
                  <input [(ngModel)]="form.price" name="price" type="number" class="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white" />
                </div>
                <div>
                  <label class="text-xs uppercase tracking-[0.24em] text-slate-300">Team price</label>
                  <input [(ngModel)]="form.teamPrice" name="teamPrice" type="number" class="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white" />
                </div>
              </div>
              <div>
                <label class="text-xs uppercase tracking-[0.24em] text-slate-300">Preview image URL</label>
                <input [(ngModel)]="form.previewImageUrl" name="previewImageUrl" class="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-slate-400" />
              </div>
              <div>
                <label class="text-xs uppercase tracking-[0.24em] text-slate-300">Download URL</label>
                <input [(ngModel)]="form.downloadUrl" name="downloadUrl" class="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-slate-400" />
              </div>
              <div>
                <label class="text-xs uppercase tracking-[0.24em] text-slate-300">Features</label>
                <textarea [(ngModel)]="form.featuresText" name="featuresText" rows="4" class="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-slate-400"></textarea>
              </div>
              @if (error()) {
                <div class="rounded-[1.25rem] border border-red-300/40 bg-red-500/10 p-4 text-sm text-red-100">
                  {{ error() }}
                </div>
              }
              <div class="flex flex-wrap gap-3">
                <button type="submit" [disabled]="saving()" class="accent-button rounded-full px-5 py-3 text-sm font-semibold transition disabled:opacity-60">
                  {{ saving() ? 'Saving…' : editingProductId() ? 'Update product' : 'Create product' }}
                </button>
                <button type="button" (click)="resetForm()" class="secondary-button rounded-full px-5 py-3 text-sm font-semibold transition">
                  Reset
                </button>
              </div>
            </form>
          </div>

          <div class="space-y-4">
            <div class="section-shell rounded-[1.5rem] p-5">
              <div class="text-xs uppercase tracking-[0.24em] text-slate-400">Orders</div>
              <div class="mt-4 space-y-3">
                @for (order of orders(); track order.id) {
                  <div class="rounded-[1.25rem] border border-slate-200 p-4">
                    <div class="flex items-center justify-between gap-4">
                      <div>
                        <div class="text-lg font-semibold text-slate-950">Order #{{ order.id }}</div>
                        <div class="mt-1 text-sm text-slate-600">{{ order.email }}</div>
                      </div>
                      <div class="text-right">
                        <div class="rounded-full bg-[#f8f3e8] px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-700">{{ order.status }}</div>
                        <div class="mt-2 text-lg font-semibold text-slate-950">\${{ order.total }}</div>
                      </div>
                    </div>
                    <div class="mt-3 text-sm text-slate-600">{{ orderItemNames(order) }}</div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8">
          <div class="text-xs uppercase tracking-[0.24em] text-slate-400">Live catalog</div>
          <div class="mt-4 grid gap-4 xl:grid-cols-3">
            @for (product of products(); track product.id) {
              <div class="soft-card rounded-[1.5rem] p-5">
                <img [src]="product.previewImageUrl" [alt]="product.name" class="h-40 w-full rounded-[1.25rem] object-cover" />
                <div class="mt-4 text-xs uppercase tracking-[0.24em] text-slate-400">{{ product.category }}</div>
                <h2 class="mt-2 text-2xl font-semibold text-slate-950">{{ product.name }}</h2>
                <p class="mt-2 text-sm leading-6 text-slate-600">{{ product.description }}</p>
                <div class="mt-4 text-sm font-semibold text-slate-900">\${{ product.price }} / \${{ product.teamPrice }}</div>
                <div class="mt-4 flex flex-wrap gap-2">
                  <button type="button" (click)="editProduct(product)" class="secondary-button rounded-full px-4 py-2 text-sm font-semibold transition">
                    Edit
                  </button>
                  <button type="button" (click)="deleteProduct(product.id)" class="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:border-red-300">
                    Delete
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `
})
export class AdminComponent implements OnInit {
  private readonly api = inject(ApiService);
  protected readonly products = signal<Product[]>([]);
  protected readonly orders = signal<OrderSummary[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly editingProductId = signal<number | null>(null);

  protected readonly form = {
    name: '',
    slug: '',
    description: '',
    category: '',
    price: 19,
    teamPrice: 59,
    previewImageUrl: 'https://placehold.co/1200x900?text=TailwindVault+Pack',
    downloadUrl: 'https://downloads.tailwindvault.dev/new-pack.zip',
    featuresText: 'Responsive layout\nTailwind-ready markup\nProduction states'
  };

  protected readonly queues = computed(() => [
    {
      kicker: 'Catalog',
      title: 'Live products',
      value: String(this.products().length).padStart(2, '0'),
      description: 'Current marketplace packs visible to buyers.'
    },
    {
      kicker: 'Revenue',
      title: 'Order volume',
      value: `\$${this.orders().reduce((sum, order) => sum + order.total, 0)}`,
      description: 'Aggregate order value recorded in the MVP API.'
    },
    {
      kicker: 'Operations',
      title: 'Pending checkouts',
      value: String(this.orders().filter((order) => order.status !== 'paid').length).padStart(2, '0'),
      description: 'Orders that still need payment confirmation.'
    }
  ]);

  async ngOnInit(): Promise<void> {
    await this.loadAdminData();
  }

  async saveProduct(): Promise<void> {
    this.saving.set(true);
    this.error.set(null);

    const payload = {
      name: this.form.name.trim(),
      slug: this.form.slug.trim(),
      description: this.form.description.trim(),
      category: this.form.category.trim(),
      price: Number(this.form.price),
      teamPrice: Number(this.form.teamPrice),
      previewImageUrl: this.form.previewImageUrl.trim(),
      downloadUrl: this.form.downloadUrl.trim(),
      features: this.form.featuresText
        .split('\n')
        .map((feature) => feature.trim())
        .filter(Boolean)
    };

    try {
      if (this.editingProductId()) {
        await firstValueFrom(this.api.updateProduct(this.editingProductId()!, payload));
      } else {
        await firstValueFrom(this.api.createProduct(payload));
      }

      this.resetForm();
      await this.loadAdminData();
    } catch {
      this.error.set('Unable to save the product right now.');
    } finally {
      this.saving.set(false);
    }
  }

  editProduct(product: Product): void {
    this.editingProductId.set(Number(product.id));
    this.form.name = product.name;
    this.form.slug = product.slug;
    this.form.description = product.description;
    this.form.category = product.category;
    this.form.price = product.price;
    this.form.teamPrice = product.teamPrice;
    this.form.previewImageUrl = product.previewImageUrl;
    this.form.downloadUrl = product.downloadUrl ?? '';
    this.form.featuresText = product.features.join('\n');
  }

  async deleteProduct(productId: number | string): Promise<void> {
    if (!window.confirm('Delete this product from the marketplace?')) {
      return;
    }

    try {
      await firstValueFrom(this.api.deleteProduct(productId));
      await this.loadAdminData();
    } catch {
      this.error.set('Unable to delete that product.');
    }
  }

  resetForm(): void {
    this.editingProductId.set(null);
    this.error.set(null);
    this.form.name = '';
    this.form.slug = '';
    this.form.description = '';
    this.form.category = '';
    this.form.price = 19;
    this.form.teamPrice = 59;
    this.form.previewImageUrl = 'https://placehold.co/1200x900?text=TailwindVault+Pack';
    this.form.downloadUrl = 'https://downloads.tailwindvault.dev/new-pack.zip';
    this.form.featuresText = 'Responsive layout\nTailwind-ready markup\nProduction states';
  }

  orderItemNames(order: OrderSummary): string {
    return order.items?.map((item) => item.productName).join(', ') || 'No line items recorded';
  }

  private async loadAdminData(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const result = await firstValueFrom(
        forkJoin({
          products: this.api.getProducts({ page: 1, limit: 50 }),
          orders: this.api.getOrders()
        })
      );

      this.products.set(result.products.products);
      this.orders.set(result.orders);
    } catch {
      this.error.set('We could not load the admin data.');
    } finally {
      this.loading.set(false);
    }
  }
}
