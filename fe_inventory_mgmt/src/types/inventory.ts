export interface InventoryItem {
  id: number;
  sku: string;
  name: string;
  description: string;
  quantity: number;
  price: string;
  category: Category;
  low_stock: string;
  imageUrl?: string;
  lastUpdated?: string;
}
interface Category {
  id: number;
  name: string;
  description: string;
}
