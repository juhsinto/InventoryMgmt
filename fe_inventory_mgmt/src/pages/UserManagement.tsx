import { useSuspenseQuery } from "@tanstack/react-query";
import Layout from "../components/common/Layout";
import api from "../utils/api";
import UserTable from "../components/UserTable";
import { User } from "../types/user";

const UserManagement: React.FC = () => {
  const getUsers = async (): Promise<User[]> => {
    const response = await api.get("/api/users/");
    return await response.data;
  };
  const { data } = useSuspenseQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
  // todo mutation

  return (
    <Layout
      headerTitle="User Management"
      headerSubtitle="Manage users in the system"
    >
      <div className=" mx-auto">
        <p className="text-black ">Manage users here</p>
        <div className="overflow-hidden shadow sm:rounded-md text-black">
          <UserTable users={data} />
        </div>
      </div>
    </Layout>
  );
};

export default UserManagement;
