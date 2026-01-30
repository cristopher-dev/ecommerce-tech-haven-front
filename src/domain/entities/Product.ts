export interface Product {
  id: string | number; // Accept both string (from API) and number
  name: string;
  price: number;
  image?: string; // Optional as API may return imageUrl instead
  discount: number;
  stock?: number; // Optional stock field from API
  description?: string; // Optional description field from API
}
