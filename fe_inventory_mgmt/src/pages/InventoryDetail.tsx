import React from "react";
import Layout from "../components/Layout";
import { type InventoryItem } from "../types/inventory";
import mockDetailDataJson from "../resources/mockDetailData.json";

const InventoryDetail: React.FC = () => {
  // TODO: use tanstackQuery to fetch data from API
  // const { id } = useParams();

  const item: InventoryItem = mockDetailDataJson;

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
      // headerSubtitle={`SKU: ${item.sku}`}
    >
      <div className="bg-white shadow overflow-hidden sm:rounded-lg max-w-4xl mx-auto">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
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
