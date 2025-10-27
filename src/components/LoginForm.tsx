"use client";

import { useState } from "react";
import { userService } from "@/lib/userService";
import { useAuth, User } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { data, error } = await userService.login(username, password);

      if (error) {
        setMessage("❌ " + error);
      } else if (!data) {
        setMessage("❌ Invalid credentials");
      } else {
        // Ensure the returned data matches User type
        const loggedInUser: User = {
          id: data.id,
          username: data.username,
          role: data.role,
        };
        login(loggedInUser);
        setMessage(`✅ Welcome ${data.username}! Role: ${data.role}`);
        setTimeout(() => {
          router.push("/");
        }, 500);
      }
    } catch (err) {
      setMessage("❌ Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="max-w-sm w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-4"
      >
        <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-gray-100">
          Login
        </h2>

        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && (
          <p
            className={`text-center text-sm ${
              message.startsWith("✅") ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
