import React from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/common/Layout";
import { useForm } from "react-hook-form";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { getCategories } from "../api/category";
import { useNavigate } from "react-router-dom";
import { addInventoryItem } from "../api/item";

const InventoryAdd: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: categories } = useSuspenseQuery({
    queryKey: ["itemCategories"],
    queryFn: getCategories,
  });

  const addItem = useMutation({
    mutationFn: (data: {
      name: string;
      description: string;
      sku: string;
      category: string;
      quantity: number;
      price: string;
    }) => {
      return addInventoryItem(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventoryItems"] });
      alert("new item added");
      navigate("/inventory");
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
    price: string;
  }>();
  const onSubmit = (data: {
    name: string;
    description: string;
    sku: string;
    category: string;
    quantity: number;
    price: string;
  }) => {
    addItem.mutate(data);
  };

  return (
    <Layout
      headerTitle="Inventory Stock Dashboard"
      headerSubtitle={`Welcome, ${user?.role}`}
    >
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
    </Layout>
  );
};

export default InventoryAdd;
