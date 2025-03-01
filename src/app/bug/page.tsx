"use client";

import Image from "next/image";
import { useState } from "react";

export default function BugReportPage() {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    priority: string;
    file: File | null;
  }>({
    title: "",
    description: "",
    priority: "low",
    file: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Bug Report Submitted:", formData);

    // Prepare email data
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("priority", formData.priority);
    if (formData.file) {
      formDataToSend.append("file", formData.file);
    }

    try {
      const response = await fetch("/api/sendBugReport", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Bug report submitted successfully!");
      } else {
        alert("Failed to submit bug report.");
      }
    } catch (error) {
      console.error("Error submitting bug report:", error);
      alert("An error occurred while submitting the bug report.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow text-[var(--secondary-color)]">
      <h1 className="text-2xl font-bold mb-4">Report a Bug</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold">
            Attach Screenshot (optional)
          </label>
          <input type="file" onChange={handleFileChange} className="w-full" />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <Image
              src="/images/animations/loadingwheel.svg"
              alt="Loading"
              width={20}
              height={20}
            />
          ) : (
            "Submit Bug Report"
          )}
        </button>
      </form>
    </div>
  );
}
