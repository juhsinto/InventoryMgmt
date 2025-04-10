import { InventoryItem } from "../types/inventory";
import api from "./api";

export const getInventory = async (): Promise<InventoryItem[]> => {
  const response = await api.get("/api/items/");

  return await response.data;
};
