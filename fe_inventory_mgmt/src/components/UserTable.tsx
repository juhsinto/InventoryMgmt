import { ChangeEvent, useState } from "react";
import { User, UserRole } from "../types/user";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getUsers } from "../api/users";

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
  const [role, setRole] = useState<UserRole>(user.role);

  const handleRoleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newRole = event.target.value;
    console.log("jm: new role     ", newRole);
    setRole(newRole as UserRole);
    // onRoleChange(user.id, newRole); // Notify the parent component of the change
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
          value={role}
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
