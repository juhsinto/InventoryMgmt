export type UserRole = "admin" | "manager" | "user";

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  is_active?: boolean;
  date_added?: string;
  added_by?: string;
}
