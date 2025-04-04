import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import Button from "../components/common/Button";
import Section from "../components/common/Section";
import inventoryJson from "../resources/mockData.json";
import { InventoryItem } from "../types/inventory";
import RoleBasedComponent from "../components/RoleBasedComponent";

const InventoryStock: React.FC = () => {
  const { user, userRole, logout } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editQuantity, setEditQuantity] = useState<number | undefined>(0);

  // TODO: use tanstackQuery to fetch data from API
  const inventoryItems: InventoryItem[] = inventoryJson;

  // Fetch inventory data
  useEffect(() => {
    // Mock API call
    setTimeout(() => {
      setInventory(inventoryItems);
      setLoading(false);
    }, 1);
  }, []);

  const handleEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setEditQuantity(item.quantity);
  };

  const handleSave = (id: number) => {
    setInventory(
      inventory.map((item) =>
        item.id === id ? { ...item, quantity: editQuantity } : item
      )
    );
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  if (loading) {
    return <div className="p-6">Loading inventory...</div>;
  }

  return (
    <Layout
      headerTitle="Inventory Stock"
      headerSubtitle={`Welcome, ${user?.username || "User"}`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Current Inventory
        </h2>
        <Button variant="secondary" onClick={logout}>
          Sign Out
        </Button>

        <RoleBasedComponent allowedRoles={["admin"]}>
          <Button className="text-white px-4 py-2 rounded">Add New Item</Button>
          {/* TODO: implement add item feature */}
        </RoleBasedComponent>
      </div>

      <Section title="Inventory Overview">
        <div className="overflow-x-auto">
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
                  stock level
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
                    {item.category}
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
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-blue-500 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${
              item.status === "In Stock"
                ? "bg-green-100 text-green-800"
                : item.status === "Low Stock"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
                    >
                      {item.status}
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
      </Section>
    </Layout>
  );
};

export default InventoryStock;
