import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { type InventoryItem } from "../types/inventory";
import mockDetailDataJson from "../resources/mockDetailData.json";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RoleBasedComponent from "../components/RoleBasedComponent";
import Button from "../components/common/Button";

const InventoryDetail: React.FC = () => {
  // TODO: use tanstackQuery to fetch data from API
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const { userRole } = useAuth();

  const [item, setItem] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<InventoryItem>>({});

  const mockItem: InventoryItem = mockDetailDataJson;

  useEffect(() => {
    // Mock API call
    setTimeout(() => {
      // Mock detailed item data
      // const mockItem: InventoryItem = {
      //   id: id || "1",
      //   name: `Product ${id}`,
      //   description:
      //     "Detailed product description goes here. This is a sample product with various features and specifications.",
      //   quantity: 25,
      //   price: 19.99,
      //   category: "Electronics",
      //   supplier: "Supplier Inc.",
      //   lastUpdated: "2025-03-28",
      // };

      setItem(mockItem);
      setFormData(mockItem);
      setLoading(false);
    }, 1);
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "quantity" || name === "price" ? parseFloat(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this to your API
    setItem(formData as InventoryItem);
    setEditing(false);
    // Show success message
    alert("Item updated successfully");
  };

  if (loading) {
    return <div className="p-6">Loading item details...</div>;
  }

  if (!item) {
    return <div className="p-6 text-red-600">Item not found</div>;
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

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
              {item.category}
            </p>
          </div>
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
                  Price: {formatCurrency(item.price)}
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
          <InfoRow label="Category" value={item.category} />
        </dl>
      </div>
    </Layout>
  );
};

export default InventoryDetail;
