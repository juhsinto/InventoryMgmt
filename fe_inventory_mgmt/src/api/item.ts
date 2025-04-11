import { InventoryItem } from "../types/inventory";
import { InventoryItemHistory } from "../types/item_history";
import api from "./api";

export const getItemDetails = async (id: string): Promise<InventoryItem> => {
  const response = await api.get(`/api/items/${id}/`);

  if (response.status !== 200) {
    throw new Error("Failed to get item");
  }
  const inventoryItem: InventoryItem = response.data;
  return inventoryItem;
};

export const addInventoryItem = async ({
  name,
  description,
  sku,
  category,
  quantity,
  price,
}: Partial<InventoryItem>): Promise<InventoryItem> => {
  const response = await api.post(`/api/items/`, {
    name,
    description,
    sku,
    category,
    quantity,
    price,
  });
  if (response.status !== 201) {
    throw new Error("Failed to create item");
  }

  return await response.data;
};

// export const updateInventoryItem = async ({
//   name,
//   description,
//   sku,
//   category,
//   quantity,
//   price,
//   id
// }: Partial<InventoryItem>) => {
//   const response = await api.patch(`/api/items/${id}/`, {
//     name,
//     description,
//     sku,
//     category,
//     quantity,
//     price,
//   });
//   if (response.status !== 201) {
//     throw new Error("Failed to update item");
//   }

//   return await response.data;
// };

export const getItemHistory = async (
  id: string
): Promise<InventoryItemHistory[]> => {
  const response = await api.get(`/api/items/${id}/history/`);

  if (response.status !== 200) {
    throw new Error("Failed to get item history");
  }
  const inventoryItemHistory: InventoryItemHistory[] = response.data;
  return inventoryItemHistory;
};

export const patchItem = async (id: number, data: Partial<InventoryItem>) => {
  const response = await api.patch(`/api/items/${id}/`, { ...data });

  if (response.status !== 200) {
    throw new Error("Failed to patch item");
  }
  const inventoryItem: InventoryItem = response.data;
  return inventoryItem;
};
