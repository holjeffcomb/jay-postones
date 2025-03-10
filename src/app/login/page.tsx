"use client";

import { login } from "./actions";
import { useGlobalContext } from "../_context/GlobalContext";
import { createClient } from "../utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { isLoggingIn, setIsLoggingIn, setIsLoggedIn, setUser } =
    useGlobalContext();

  const supabase = createClient();
  const router = useRouter();
  // Define the handleFormSubmit function
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission behavior

    const formData = new FormData(event.currentTarget); // Get form data
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    setIsLoggingIn(true); // Optional: Set loading state if needed

    try {
      await login({ email, password }); // Call your login action with form data
      // Handle successful login (e.g., redirect or update UI)

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("first_name, last_name, membership_level")
        .eq("email", email)
        .single();

      if (error) {
        throw error;
      }
      setUser({
        firstName: profile?.first_name,
        lastName: profile?.last_name,
        membershipLevel: profile?.membership_level,
      });
      setIsLoggedIn(true);
      router.push("/");
    } catch (error) {
      console.error("Login failed", error); // Handle login failure
      setIsLoggedIn(false);
    } finally {
      setIsLoggingIn(false); // Reset loading state
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-[var(--primary-color)]">
      <div className="bg-gray-800 text-white shadow-lg rounded-lg w-[500px] p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Welcome Back
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-300 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="bg-gray-700 text-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="bg-gray-700 text-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <div className="flex flex-col justify-between items-center gap-5">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Logging In..." : "Log In"}
            </button>
          </div>
          <div className="mt-4 text-center">
            <a
              href="/register"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Not a member? Register here.
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
