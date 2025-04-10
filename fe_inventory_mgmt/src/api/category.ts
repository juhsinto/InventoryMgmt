import { InventoryItemCategory } from "../types/category";
import api from "./api";

export const getCategories = async (): Promise<InventoryItemCategory[]> => {
  const response = await api.get("/api/categories/");

  return await response.data;
};

export const addCategory = async ({
  name,
  description,
}: Partial<InventoryItemCategory>): Promise<InventoryItemCategory> => {
  const response = await api.post("/api/categories/", {
    name,
    description,
  });
  if (response.status !== 201) {
    throw new Error("Failed to create user");
  }

  return await response.data;
};
