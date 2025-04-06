import axios from "axios";
import { InventoryItem } from "../types/inventory";

export const getItem = async (id: string) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No access token found");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const response = await axios.get(`http://127.0.1:8000/api/inventory/${id}/`, {
    headers,
  });
  if (response.status !== 200) {
    throw new Error("Failed to fetch item");
  }
  const inventoryItem: InventoryItem = response.data;
  return inventoryItem;
};

export const patchItem = async (id: number, data: Partial<InventoryItem>) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No access token found");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const response = await axios.patch(
    `http://127.0.1:8000/api/inventory/${id}/`,
    { ...data },
    {
      headers,
    }
  );
  if (response.status !== 200) {
    throw new Error("Failed to fetch item");
  }
  const inventoryItem: InventoryItem = response.data;
  return inventoryItem;
};
