export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
