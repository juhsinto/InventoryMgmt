export interface InventoryItemHistory {
  timestamp: string;
  user: string;
  quantity_before: number;
  quantity_after: number;
  low_stock_before: boolean | null;
  low_stock_after: boolean | null;
}
