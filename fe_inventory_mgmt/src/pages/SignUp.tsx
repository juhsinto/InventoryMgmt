import React, { useState } from "react";
import Layout from "../components/common/Layout";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../utils/register";

const SignUp: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await registerUser(username, password, email).then(async () => {
        const success = await login(username, password);
        if (success) {
          navigate("/inventory");
        }
      });
    } catch (err) {
      setError("An error occurred during sign up " + err?.toString());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout
      headerTitle="Sign Up"
      headerSubtitle="Create a new account in our system"
    >
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing up..." : "Create Account"}
            </Button>
          </div>

          <p className="text-black">
            Just so you know, the default account is a 'regular user' - pls
            contact the admin if you need special permissions
          </p>
        </form>
      </div>
    </Layout>
  );
};

export default SignUp;
