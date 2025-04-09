import React from "react";
import Layout from "../components/common/Layout";
import { useNavigate, useParams } from "react-router-dom";
import RoleBasedComponent from "../components/RoleBasedComponent";
import Button from "../components/common/Button";
import { getItemDetails } from "../api/item";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import api from "../api/api";
import { InventoryItem } from "../types/inventory";

const InventoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { data: item } = useSuspenseQuery({
    queryKey: ["itemDetails", id],
    queryFn: () => getItemDetails(id!),
  });

  const deleteItem = useMutation({
    mutationFn: (item: InventoryItem) => {
      return api.delete(`/api/items/${item.id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventoryItems"] });
      navigate("/inventory");
    },
  });

  if (!item) {
    return (
      <Layout headerTitle="Inventory Item Details">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg max-w-4xl mx-auto"></div>
      </Layout>
    );
  }

  const InfoRow: React.FC<{
    label: string;
    value: string | number;
    type?: string;
  }> = ({ label, value, type }) => (
    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
        {type === "monetary" ? `$${value}` : value}
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
        </div>

        <div className="border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <div className="aspect-w-16 aspect-h-9 md:aspect-w-4 md:aspect-h-3">
              {/* <img src={item.imageUrl} alt={item.name} className="" /> */}

              <p className="object-cover rounded-lg shadow-lg w-full h-full text-black">
                placeholder image
              </p>
            </div>
            <div className=" px-4 py-5 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-6 rounded-lg">
              <div className="space-y-2 ">
                <RoleBasedComponent allowedRoles={["admin"]}>
                  <div className="flex sm:block gap-2 sm:gap-0 md:grid md:gap-5 md:grid-cols-2 lg:grid lg:gap-5 lg:grid-cols-2">
                    <Button
                      onClick={() => {
                        const confirmed = confirm("Are you sure ?");
                        if (confirmed) deleteItem.mutate(item);
                      }}
                      variant="secondary"
                      className="px-2 py-1 rounded text-sm  sm:block w-full sm:w-auto"
                    >
                      Delete
                    </Button>
                    <Button
                      variant="secondary"
                      className="px-2 py-1 rounded text-sm sm:block w-full sm:w-auto"
                    >
                      Edit
                    </Button>
                  </div>
                </RoleBasedComponent>
              </div>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          <InfoRow label="SKU" value={item.sku} />
          <InfoRow label="Name" value={item.name} />

          <InfoRow label="Description" value={item.description} />
          <InfoRow label="Price" type="monetary" value={item.price} />
          <InfoRow label="Category" value={item.category_name} />

          <InfoRow label="Low Stock ?" value={item.low_stock.toString()} />
        </div>
      </div>
    </Layout>
  );
};

export default InventoryDetail;
