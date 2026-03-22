import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { License } from '../models/license.model';
import { OrderSummary, CheckoutOrderPayload } from '../models/order.model';
import { Product, ProductListResponse } from '../models/product.model';
import { User } from '../models/user.model';

export type { Product } from '../models/product.model';

interface AuthResponse {
  accessToken: string;
  user: User;
}

interface StripeWebhookPayload {
  type: 'checkout.session.completed';
  data: {
    object: {
      orderId: number;
      sessionId?: string;
      metadata?: {
        orderId?: number;
      };
    };
  };
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl =
    typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? 'http://localhost:3000/api'
      : '/api';
  private readonly apiOrigin = this.apiUrl.endsWith('/api')
    ? this.apiUrl.slice(0, -4)
    : this.apiUrl;

  getProducts(params: Record<string, string | number> = {}): Observable<ProductListResponse> {
    const httpParams = Object.entries(params).reduce(
      (acc, [key, value]) => acc.set(key, String(value)),
      new HttpParams()
    );

    return this.http.get<ProductListResponse>(`${this.apiUrl}/products`, {
      params: httpParams
    });
  }

  getProductBySlug(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${slug}`);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/category/${category}`);
  }

  getCategories(): Observable<Array<{ id: string; name: string }>> {
    return this.http.get<Array<{ id: string; name: string }>>(`${this.apiUrl}/products/categories`);
  }

  register(payload: { name: string; email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, payload);
  }

  login(payload: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, payload);
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/auth/profile`);
  }

  createOrder(payload: CheckoutOrderPayload): Observable<OrderSummary> {
    return this.http.post<OrderSummary>(`${this.apiUrl}/orders`, payload);
  }

  getOrders(): Observable<OrderSummary[]> {
    return this.http.get<OrderSummary[]>(`${this.apiUrl}/orders`);
  }

  getLicenses(): Observable<License[]> {
    return this.http.get<License[]>(`${this.apiUrl}/licenses`);
  }

  validateLicense(payload: { code: string; productSlug?: string }): Observable<{ valid: boolean; license?: License }> {
    return this.http.post<{ valid: boolean; license?: License }>(`${this.apiUrl}/licenses/validate`, payload);
  }

  createProduct(payload: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, payload);
  }

  updateProduct(productId: number | string, payload: Partial<Omit<Product, 'id'>>): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/products/${productId}`, payload);
  }

  deleteProduct(productId: number | string): Observable<{ deleted: boolean }> {
    return this.http.delete<{ deleted: boolean }>(`${this.apiUrl}/products/${productId}`);
  }

  triggerStripeWebhook(payload: StripeWebhookPayload): Observable<{ received: boolean; order?: OrderSummary }> {
    return this.http.post<{ received: boolean; order?: OrderSummary }>(`${this.apiUrl}/webhooks/stripe`, payload);
  }

  resolveApiUrl(path: string): string {
    if (!path) {
      return this.apiUrl;
    }

    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    if (path.startsWith('/')) {
      return `${this.apiOrigin}${path}`;
    }

    return `${this.apiUrl}/${path.replace(/^\//, '')}`;
  }
}
