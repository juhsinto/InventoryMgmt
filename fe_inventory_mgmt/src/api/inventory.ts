import axios from "axios";
import { InventoryItem } from "../types/inventory";

export const getInventoryItems = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No access token found");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const response = await axios.get("http://127.0.1:8000/api/inventory/", {
    headers,
  });
  if (response.status !== 200) {
    throw new Error("Failed to fetch inventory items");
  }
  const inventoryItems: InventoryItem[] = response.data;
  return inventoryItems;
};
