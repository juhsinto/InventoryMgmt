export interface InventoryItem {
  id: number;
  sku: string;
  name: string;
  category: string;
  status: string;
  description: string;
  price: number;
  quantity?: number;
  stock?: string;
  imageUrl?: string;
  lastUpdated?: string;
}
