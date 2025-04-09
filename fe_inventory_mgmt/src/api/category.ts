import { InventoryItemCategory } from "../types/category";
import api from "./api";

export const getCategories = async (): Promise<InventoryItemCategory[]> => {
  const response = await api.get("/api/categories/");

  return await response.data;
};
