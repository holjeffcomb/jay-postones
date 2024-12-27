"use client";

import { signup } from "../login/actions";
import { useState } from "react";

export default function RegistrationPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError(""); // Clear any previous errors

    const formData = new FormData(e.currentTarget);
    const { error: authError } = await signup(formData);

    if (authError) {
      // Handle specific error scenarios
      if (authError.message === "User already exists") {
        setError("An account with this email already exists. Please log in.");
      } else {
        setError(
          authError.message || "Something went wrong. Please try again."
        );
      }
    } else {
      // On success, redirect or notify the user
      alert(
        "Registration successful! Check your inbox to validate your email address."
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-[var(--primary-color)]">
      <div className="bg-gray-800 text-white shadow-lg rounded-lg w-[500px] p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Create Your Account
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
          <div className="flex gap-4">
            <div className="flex flex-col w-1/2">
              <label
                htmlFor="firstName"
                className="text-sm font-medium text-gray-300 mb-2"
              >
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="bg-gray-700 text-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="First name"
              />
            </div>
            <div className="flex flex-col w-1/2">
              <label
                htmlFor="lastName"
                className="text-sm font-medium text-gray-300 mb-2"
              >
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="bg-gray-700 text-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Last name"
              />
            </div>
          </div>
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-700 text-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Create a password"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-300 mb-2"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-gray-700 text-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your password"
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Register
          </button>
          <div className="mt-4 text-center">
            <a
              href="/login"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Already have an account? Log in here.
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
