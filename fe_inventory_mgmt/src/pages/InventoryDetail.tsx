import React, { useState } from "react";
import Layout from "../components/common/Layout";
import { useNavigate, useParams } from "react-router-dom";
import RoleBasedComponent from "../components/RoleBasedComponent";
import Button from "../components/common/Button";
import { getItemDetails, patchItem } from "../api/item";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import api from "../api/api";
import { InventoryItem } from "../types/inventory";
import Section from "../components/common/Section";
import ItemHistory from "../components/ItemHistory";
import { useForm } from "react-hook-form";
import { getCategories } from "../api/category";

const InventoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { data: item } = useSuspenseQuery({
    queryKey: ["itemDetails", id],
    queryFn: () => getItemDetails(id!),
  });

  const { data: categories } = useSuspenseQuery({
    queryKey: ["itemCategories"],
    queryFn: getCategories,
  });

  const deleteItem = useMutation({
    // TODO - refactor ; put the api call in the /api/item.ts
    mutationFn: (item: InventoryItem) => {
      return api.delete(`/api/items/${item.id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventoryItems"] });
      navigate("/inventory");
    },
  });

  const updateItem = useMutation({
    mutationFn: (item: { id: number; data: Partial<InventoryItem> }) =>
      patchItem(item.id, item.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["itemDetails", "inventoryItems"],
      });
      alert("item updated");
      // navigate("/inventory");
    },
  });

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<{
    name: string;
    description: string;
    sku: string;
    category: string;
    quantity: number;
    price: number;
  }>({ values: item });
  const onSubmit = (formData: {
    name: string;
    description: string;
    sku: string;
    category: string;
    quantity: number;
    price: number;
  }) => {
    console.log("form data to POST ", formData);
    updateItem.mutate({ id: Number(id), data: formData });
  };

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
                      onClick={() => setIsEditing((prev) => !prev)}
                      className="px-2 py-1 rounded text-sm sm:block w-full sm:w-auto"
                    >
                      {isEditing ? "Cancel" : "Edit"}
                    </Button>
                  </div>
                </RoleBasedComponent>
              </div>
            </div>
          </div>
        </div>

        {!isEditing ? (
          <>
            <div className="divide-y divide-gray-200">
              <InfoRow label="SKU" value={item.sku} />
              <InfoRow label="Name" value={item.name} />

              <InfoRow label="Description" value={item.description} />
              <InfoRow label="Price" type="monetary" value={item.price} />
              <InfoRow label="Category" value={item.category_name} />

              <InfoRow label="Low Stock ?" value={item.low_stock.toString()} />
            </div>
          </>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                maxLength={100}
                placeholder="Enter product name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-red-500 text-xs italic">
                  {errors.name.message?.toString()}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="sku"
              >
                SKU
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="sku"
                type="text"
                placeholder="Enter SKU"
                {...register("sku", { required: "SKU is required" })}
              />
              {errors.sku && (
                <p className="text-red-500 text-xs italic">
                  {errors.sku.message?.toString()}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="description"
                maxLength={200}
                placeholder="Enter description (max 200 characters)"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-red-500 text-xs italic">
                  <p className="text-red-500 text-xs italic">
                    {errors.description.message?.toString()}
                  </p>
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="category"
              >
                Category
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="category"
                {...register("category", { required: "Category is required" })}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-xs italic">
                  <p className="text-red-500 text-xs italic">
                    {errors.category.message?.toString()}
                  </p>
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="quantity"
              >
                Quantity
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="quantity"
                type="number"
                placeholder="Enter quantity"
                {...register("quantity")}
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="price"
              >
                Price
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="price"
                type="number"
                step=".01"
                placeholder="Enter Price"
                {...register("price", {
                  required: "Price is required",
                  valueAsNumber: true,
                })}
              />
              {errors.price && (
                <p className="text-red-500 text-xs italic">
                  <p className="text-red-500 text-xs italic">
                    {errors.price.message?.toString()}
                  </p>
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>

      <RoleBasedComponent allowedRoles={["admin"]} fallback={<></>}>
        <Section className="pt-10" title="inventory item history">
          <ItemHistory id={id!} />
        </Section>
      </RoleBasedComponent>
    </Layout>
  );
};

export default InventoryDetail;
