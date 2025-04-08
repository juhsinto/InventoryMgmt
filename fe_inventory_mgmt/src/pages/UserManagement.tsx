import { useQuery } from "@tanstack/react-query";
import Layout from "../components/common/Layout";
import api from "../utils/api";
import UserTable from "../components/UserTable";
import { User } from "../types/user";

const UserManagement: React.FC = () => {
  const getUsers = async () => {
    const response = await api.get("/api/users/");
    return await response.data;
  };

  const data = useQuery({
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
          <UserTable users={data.data as User[]} />
        </div>
      </div>
    </Layout>
  );
};

export default UserManagement;
