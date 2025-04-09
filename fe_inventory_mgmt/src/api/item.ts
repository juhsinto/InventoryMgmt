import { InventoryItem } from "../types/inventory";
import api from "./api";

export const getItemDetails = async (id: string): Promise<InventoryItem> => {
  const response = await api.get(`/api/items/${id}/`);

  if (response.status !== 200) {
    throw new Error("Failed to get item");
  }
  const inventoryItem: InventoryItem = response.data;
  return inventoryItem;
};

export const patchItem = async (id: number, data: Partial<InventoryItem>) => {
  const response = await api.patch(`/api/items/${id}/`, { ...data });
  if (response.status !== 200) {
    throw new Error("Failed to patch item");
  }
  const inventoryItem: InventoryItem = response.data;
  return inventoryItem;
};
