import { Suspense } from "react";
import Layout from "../components/common/Layout";
import UserTable from "../components/UserTable";
import LoadingSpinner from "../components/common/Loading";

// import Loading from "/Loading.svg?url&react";

const UserManagement: React.FC = () => {
  return (
    <Layout
      headerTitle="User Management"
      headerSubtitle="Manage users in the system"
    >
      <div className=" mx-auto">
        <p className="text-black "></p>
        <h3 className="text-1xl font-semibold text-black flex justify-center items-center pb-10">
          Manage users here
        </h3>
        <div className="overflow-hidden shadow sm:rounded-md text-black flex justify-center items-center">
          <Suspense fallback={<LoadingSpinner />}>
            <UserTable />
          </Suspense>
        </div>
      </div>
    </Layout>
  );
};

export default UserManagement;
