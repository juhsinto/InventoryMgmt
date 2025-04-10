import { User } from "../types/user";
import api from "./api";

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get("/api/users/");

  return await response.data;
};

export const patchUser = async (user: {
  userId: string;
  newUserRole: string;
}): Promise<User> => {
  return api.patch(`/api/users/${user.userId}/`, { role: user.newUserRole });
};
