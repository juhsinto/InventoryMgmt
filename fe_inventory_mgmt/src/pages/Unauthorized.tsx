import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Unauthorized: React.FC = () => {
  const { userRole } = useAuth();

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
      <p className="mb-6">
        You don't have permission to access this page. Your current role is:{" "}
        <strong>{userRole}</strong>
      </p>
      <div className="space-y-4">
        <Link
          to="/"
          className="block w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white text-center rounded"
        >
          Return to Home
        </Link>

        <Link
          to="/inventory"
          className="block w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-center rounded"
        >
          Go to Inventory
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
