import React, { useState } from "react";
import { InventoryItem } from "../../types/inventory";
import Button from "../common/Button";
import RoleBasedComponent from "../RoleBasedComponent";
import { Link } from "react-router-dom";
import { getInventory } from "../../api/inventory";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import api from "../../api/api";

const InventoryOverview: React.FC = () => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);

  const queryClient = useQueryClient();

  const { data: inventory } = useSuspenseQuery({
    queryKey: ["inventoryItems"],
    queryFn: getInventory,
  });

  const handleEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setEditQuantity(item.quantity);
  };

  const editItemQty = useMutation({
    mutationFn: (item: { id: number; newQty: number }) => {
      return api.patch(`/api/items/${item.id}/`, { quantity: item.newQty });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventoryItems"] });
      setEditingId(null);
    },
  });

  const editItemStockLevel = useMutation({
    mutationFn: (item: InventoryItem) => {
      return api.patch(`/api/items/${item.id}/`, {
        low_stock: !item.low_stock,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventoryItems"] });
    },
  });

  const handleSave = async (id: number) => {
    editItemQty.mutate({ id: id, newQty: editQuantity! });
    // TODO - edit the value in the query-cache ; avoid slow update
  };

  const handleChangeStockLevel = async (item: InventoryItem) => {
    editItemStockLevel.mutate(item);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <div className="mx-auto overflow-x-scroll">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Low stock
            </th>
            <RoleBasedComponent
              allowedRoles={["admin", "manager"]}
              fallback={<></>}
            >
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </RoleBasedComponent>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {inventory.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link
                  to={`/inventory/${item.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {item.name}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-blue-500">
                {item.category_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === item.id ? (
                  <input
                    type="number"
                    min="0"
                    value={editQuantity}
                    onChange={(e) =>
                      setEditQuantity(parseInt(e.target.value) || 0)
                    }
                    className="w-20 rounded border border-gray-300 px-2 py-1 text-blue-500"
                  />
                ) : (
                  <span
                    className={
                      item?.quantity && item.quantity <= 10
                        ? "text-red-600 font-medium"
                        : "text-blue-500"
                    }
                  >
                    {item.quantity}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-blue-500 whitespace-nowrap">
                ${item.price}
              </td>
              <td
                onClick={() => handleChangeStockLevel(item)}
                className="px-6 py-4 text-blue-500 whitespace-nowrap"
              >
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer
            ${
              item.low_stock.toString() === "true"
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
                >
                  {item.low_stock.toString()}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {/* Different actions based on role */}
                <RoleBasedComponent
                  allowedRoles={["admin", "manager"]}
                  fallback={<></>}
                >
                  {editingId === item.id ? (
                    <div className="space-x-2">
                      <Button
                        onClick={() => handleSave(item.id)}
                        className="px-2 py-1 rounded text-sm"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={handleCancel}
                        className="px-2 py-1 rounded text-sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="space-x-2">
                      <Button
                        onClick={() => handleEdit(item)}
                        className="text-white px-2 py-1 rounded text-sm"
                      >
                        Edit Stock
                      </Button>
                    </div>
                  )}
                </RoleBasedComponent>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryOverview;
