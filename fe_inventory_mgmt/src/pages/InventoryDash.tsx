import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/common/Layout";
import Button from "../components/common/Button";
import Section from "../components/common/Section";
import RoleBasedComponent from "../components/RoleBasedComponent";
import InventoryOverview from "../components/Inventory/InventoryOverview";

const InventoryDash: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <Layout
      headerTitle="Inventory Stock Dashboard"
      headerSubtitle={`Welcome, ${user?.role}`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Current Inventory
        </h2>
        <Button variant="secondary" onClick={logout}>
          Sign Out
        </Button>
      </div>

      <Section title="Inventory Overview">
        <InventoryOverview />
      </Section>

      <RoleBasedComponent allowedRoles={["admin"]}>
        <Section title="Admin only actions">
          <div className="mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Link to="/user_management/">
                <Button>Manage Users</Button>
              </Link>

              {/* TODO: ADD NEW ITEM */}
              <Link to="/inventory_add/">
                <Button className="text-white px-4 py-2">Add New Item</Button>
              </Link>

              <Link to="/bulk_update/">
                <Button className="text-white px-4 py-2">Bulk Update</Button>
              </Link>
            </div>
          </div>
        </Section>
      </RoleBasedComponent>
    </Layout>
  );
};

export default InventoryDash;
