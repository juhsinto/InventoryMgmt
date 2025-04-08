export type UserRole = "admin" | "manager" | "user";

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}
