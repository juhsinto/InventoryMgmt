import React from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/common/Layout";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCategory } from "../api/category";
import { useNavigate } from "react-router-dom";
import Section from "../components/common/Section";

const CategoryAdd: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const addItem = useMutation({
    mutationFn: (data: { name: string; description: string }) =>
      addCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itemCategories"] });
      alert("new item added");
      navigate("/inventory");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string; description: string }>();
  const onSubmit = (data: { name: string; description: string }) => {
    addItem.mutate(data);
  };

  return (
    <Layout
      headerTitle="Inventory Stock Dashboard"
      headerSubtitle={`Welcome, ${user?.role}`}
    >
      <Section title="Add new Category">
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
              placeholder="Enter category name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs italic pt-2">
                {errors.name.message?.toString()}
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
              placeholder="Enter description (Optional, max 200 characters)"
              {...register("description")}
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
      </Section>
    </Layout>
  );
};

export default CategoryAdd;
