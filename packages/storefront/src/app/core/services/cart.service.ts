import { Injectable, signal, computed } from '@angular/core';

export type LicenseType = 'single' | 'team';

export interface CartItem {
  id: string;
  productId: number;
  slug: string;
  name: string;
  previewImageUrl: string;
  licenseType: LicenseType;
  price: number;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly storageKey = 'tailwindvault_cart';
  private items = signal<CartItem[]>(this.loadCart());

  readonly count = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly total = computed(() =>
    this.items().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  readonly cartItems = computed(() => this.items());

  private loadCart(): CartItem[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveCart(items: CartItem[]): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    }

    this.items.set(items);
  }

  addItem(item: Omit<CartItem, 'id' | 'quantity'>, quantity = 1): void {
    const current = this.items();
    const itemId = `${item.productId}:${item.licenseType}`;
    const existing = current.find((cartItem) => cartItem.id === itemId);

    if (existing) {
      this.saveCart(
        current.map((cartItem) =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        )
      );
    } else {
      this.saveCart([...current, { ...item, id: itemId, quantity }]);
    }
  }

  removeItem(id: string): void {
    this.saveCart(this.items().filter((i) => i.id !== id));
  }

  updateQuantity(id: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(id);
      return;
    }

    this.saveCart(
      this.items().map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }

  clearCart(): void {
    this.saveCart([]);
  }
}
