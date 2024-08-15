"use client";

import he from "he";
import { useState, useEffect } from "react";

interface LessonData {
  date: string;
  title: string;
  link: string;
  excerpt: string;
}

export default function LatestLesson() {
  const [data, setData] = useState<LessonData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getData() {
      const baseUrl =
        typeof window === "undefined" ? process.env.NEXT_PUBLIC_BASE_URL : "";

      try {
        const res = await fetch(`${baseUrl}/api/getLatestLesson`, {
          headers: {
            "Cache-Control": "no-store",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch data from API route");
        }

        const json = await res.json();
        console.log("Client Data:", json); // Debugging output

        setData({
          date: json.date,
          title: json.title,
          link: json.link,
          excerpt: json.excerpt,
        });
      } catch (error) {
        console.error("Error fetching latest lesson:", error);
        setError("Failed to load the latest lesson.");
      }
    }

    getData();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center mt-6 mb-6 p-4 bg-white shadow-lg rounded-lg max-w-xl m-auto">
        <h1 className="text-2xl font-bold mb-4">LATEST LESSON</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col justify-center items-center mt-6 mb-6 p-4 bg-white shadow-lg rounded-lg max-w-xl m-auto">
        <h1 className="text-2xl font-bold mb-4">LATEST LESSON</h1>
        <p>Loading...</p>
      </div>
    );
  }

  // Decode the title to handle HTML entities
  const decodedTitle = he.decode(data.title);

  return (
    <div className="flex flex-col justify-center items-center mt-6 mb-6 p-4 bg-white shadow-lg rounded-lg max-w-xl m-auto">
      <h1 className="text-2xl font-bold mb-4">LATEST LESSON</h1>
      <div className="text-left">
        <p className="text-gray-600 mb-2">
          <strong>Date:</strong> {new Date(data.date).toLocaleDateString()}
        </p>
        <h2 className="text-xl font-semibold text-blue-600 mb-2">
          <a href={data.link} target="_blank" rel="noopener noreferrer">
            {decodedTitle}
          </a>
        </h2>
        <div
          className="text-gray-800"
          dangerouslySetInnerHTML={{ __html: data.excerpt }}
        />
      </div>
    </div>
  );
}
