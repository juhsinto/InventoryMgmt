import { User } from "../types/user";
import api from "./api";

export const getUsers = async (): Promise<User[]> => {
  // delay to simulate loading
  await new Promise((resolve) => setTimeout(resolve, 500));
  const response = await api.get("/api/users/");

  return await response.data;
};
