import React, { useEffect, useState } from "react";
import Layout from "../components/common/Layout";
import { type InventoryItem } from "../types/inventory";
import { useNavigate, useParams } from "react-router-dom";
import RoleBasedComponent from "../components/RoleBasedComponent";
import Button from "../components/common/Button";
import { getItem } from "../utils/item";

const InventoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  // TODO: modify the inventory details if user is admin
  // const { userRole } = useAuth();

  const [item, setItem] = useState<InventoryItem | null>(null);
  const [editing, setEditing] = useState(false);
  const [, setFormData] = useState<Partial<InventoryItem>>({});

  useEffect(() => {
    setTimeout(() => {
      const fetchItem = async () => {
        if (!id) {
          throw new Error("No ID provided");
        }
        const item = await getItem(id);
        setItem(item);
        setFormData(item);
      };

      fetchItem();
    }, 1);
  }, [id]);

  // TODO: LOADING

  if (!item) {
    return (
      <Layout headerTitle="Inventory Item Details">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg max-w-4xl mx-auto"></div>
      </Layout>
    );
  }

  const InfoRow: React.FC<{ label: string; value: string | number }> = ({
    label,
    value,
  }) => (
    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
        {value}
      </dd>
    </div>
  );

  return (
    <Layout
      headerTitle="Inventory Item Details"
      headerSubtitle={`SKU: ${item.sku}`}
    >
      <div className="bg-white shadow overflow-hidden sm:rounded-lg max-w-4xl mx-auto">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <Button
            onClick={() => navigate("/inventory")}
            className="mb-4 flex items-center hover:underline"
          >
            ← Back to Inventory
          </Button>

          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {item.name}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {item.category_name}
            </p>
          </div>
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${
              item.low_stock.toString() === "true"
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {item.low_stock.toString()}
          </span>
        </div>

        <div className="flex items-center pl-5 pb-20 gap-4">
          <RoleBasedComponent allowedRoles={["admin"]}>
            {/* TODO: implement feature - edit inventory item detail */}
            {!editing ? (
              <Button
                onClick={() => setEditing(true)}
                className="px-4 py-2 rounded"
              >
                Edit Details
              </Button>
            ) : (
              <Button
                onClick={() => setEditing(false)}
                className="px-4 py-2 rounded"
              >
                Cancel
              </Button>
            )}
          </RoleBasedComponent>
          <RoleBasedComponent allowedRoles={["admin"]}>
            <Button className="px-2 py-1 rounded text-sm">Delete</Button>
            {/* TODO: implement delete funcitonality */}
          </RoleBasedComponent>
        </div>

        <div className="border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <div className="aspect-w-16 aspect-h-9 md:aspect-w-4 md:aspect-h-3">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="object-cover rounded-lg shadow-lg w-full h-full"
              />
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-6 rounded-lg">
              <div className="space-y-2">
                <p className="text-xl font-bold text-gray-900">
                  Price: ${item.price}
                </p>
                <p className="text-sm text-gray-600">
                  Description: {item.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <dl className="divide-y divide-gray-200">
          <InfoRow label="SKU" value={item.sku} />
          <InfoRow label="Category" value={item.category_name} />
        </dl>
      </div>
    </Layout>
  );
};

export default InventoryDetail;
