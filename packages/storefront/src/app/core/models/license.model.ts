export interface License {
  id: number | string;
  code: string;
  status: 'active' | 'revoked';
  productId: number | string;
  productName: string;
  productSlug: string;
  orderId: number | string;
  downloadUrl: string;
  createdAt: string;
  expiresAt: string | null;
}
