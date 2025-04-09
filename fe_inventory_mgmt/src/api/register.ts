import api from "./api";

export const registerUser = async (
  username: string,
  password: string,
  email: string
) => {
  const response = await api.post("/api/users/", {
    username,
    password,
    email,
  });
  if (response.status !== 201) {
    throw new Error("Failed to create user");
  }

  // attempt to sign in the user after registration
  return response;
};
