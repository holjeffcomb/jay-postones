import { login } from "./actions";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center bg-[var(--primary-color)]">
      <div className="bg-gray-800 text-white shadow-lg rounded-lg w-[500px] p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Welcome Back
        </h2>
        <form className="flex flex-col gap-4">
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
              formAction={login}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Log In
            </button>
            {/* <button
              formAction={signup}
              className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Sign Up
            </button>
          </div>
          <div className="mt-4 text-center"> */}
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
