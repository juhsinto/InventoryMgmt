import { ChangeEvent } from "react";
import { User } from "../types/user";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { getUsers } from "../api/users";
import api from "../api/api";

const UserTable: React.FC = () => {
  const { data } = useSuspenseQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              ID
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Username
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Role
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              //   onRoleChange={onRoleChange}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface UserTableRowProps {
  user: User;
}

const UserTableRow: React.FC<UserTableRowProps> = ({ user }) => {
  const queryClient = useQueryClient();

  const editUserMutation = useMutation({
    mutationFn: (newUserRole: string) => {
      return api.patch(`/api/users/${user.id}/`, { role: newUserRole });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      // edge case - log the user out if they make changes to their own user
      // TODO - in useAuth - change the way users are retrieved; use the react-query getUsers - so that everything is in sync
    },
  });

  const handleRoleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newRole = event.target.value;
    editUserMutation.mutate(newRole);
  };

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {user.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {user.username}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {user.email}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <select
          value={user.role}
          onChange={handleRoleSelectChange}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
        </select>
      </td>
    </tr>
  );
};

export default UserTable;
