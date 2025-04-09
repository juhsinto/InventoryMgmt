import { InventoryItem } from "../types/inventory";
import api from "./api";

export const getInventory = async (): Promise<InventoryItem[]> => {
  // delay to simulate loading
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const response = await api.get("/api/items/");

  return await response.data;
};
