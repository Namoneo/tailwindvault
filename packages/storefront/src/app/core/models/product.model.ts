export interface Product {
  id: number | string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price: number;
  teamPrice: number;
  previewImageUrl: string;
  downloadUrl?: string;
  features: string[];
  createdAt?: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}
