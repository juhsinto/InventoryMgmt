import { InventoryItem } from "../types/inventory";
import api from "./api";

export const getInventoryItems = async () => {
  const response = await api.get("/api/items/");
  if (response.status !== 200) {
    throw new Error("Failed to get inventory items");
  }
  const inventoryItems: InventoryItem[] = response.data;
  return inventoryItems;
};
