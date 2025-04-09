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
import { InventoryItem } from "../types/inventory";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const InventoryAdd: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: categories } = useSuspenseQuery({
    queryKey: ["itemCategories"],
    queryFn: getCategories,
  });

  const addItem = useMutation({
    mutationFn: (item: { item: InventoryItem }) => {
      console.log("jm: item ", item);
      return api.post(`/api/items/`, { ...item });
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
  } = useForm();
  const onSubmit = (data) => {
    console.log("jm: data ", data);
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
            placeholder="Enter product name"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && <p className="text-red-500 text-xs italic">error</p>}
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
          {errors.sku && <p className="text-red-500 text-xs italic">error</p>}
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
            placeholder="Enter description (max 100 characters)"
            {...register("description", {
              required: "Description is required",
              maxLength: {
                value: 100,
                message: "Description must be no more than 100 characters",
              },
            })}
          />
          {errors.description && (
            <p className="text-red-500 text-xs italic">
              <p className="text-red-500 text-xs italic">error</p>
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
              <p className="text-red-500 text-xs italic">error</p>
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
            {...register("quantity", {
              required: "Quantity is required",
              valueAsNumber: true,
            })}
          />
          {errors.quantity && (
            <p className="text-red-500 text-xs italic">
              <p className="text-red-500 text-xs italic">error</p>
            </p>
          )}
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
            type="text"
            placeholder="Enter price"
            {...register("price")}
          />
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
