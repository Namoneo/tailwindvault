import { CartItem } from '../services/cart.service';

export interface OrderItemSummary {
  id: number | string;
  productId: number | string;
  productName: string;
  productSlug: string;
  quantity: number;
  unitPrice: number;
  licenseType: 'single' | 'team';
}

export interface CheckoutOrderPayload {
  email: string;
  items: Array<{
    productId: number | string;
    quantity: number;
    licenseType: 'single' | 'team';
  }>;
}

export interface OrderSummary {
  id: number | string;
  status: string;
  subtotal?: number;
  total: number;
  email: string;
  checkoutUrl?: string;
  sessionId?: string;
  paidAt?: string;
  items?: OrderItemSummary[];
  licenses?: Array<{
    id: number | string;
    code: string;
    status: string;
  }>;
  createdAt: string;
}

export interface CheckoutViewModel {
  email: string;
  items: CartItem[];
}
