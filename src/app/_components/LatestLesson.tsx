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
      <div className="flex flex-col justify-center items-center mt-12 mb-12 p-8 bg-[var(--background-color)] text-[var(--text-color)] rounded-xl max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 font-catamaran">
          LATEST LESSON
        </h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col justify-center items-center mt-12 mb-12 p-8 bg-[var(--background-color)] text-[var(--text-color)] rounded-xl max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 font-catamaran">
          LATEST LESSON
        </h1>
        <p>Loading...</p>
      </div>
    );
  }

  // Decode the title to handle HTML entities
  const decodedTitle = he.decode(data.title);

  return (
    <div className="flex flex-col justify-center items-center mt-12 mb-12 p-8 bg-[var(--background-color)] text-[var(--text-color)] rounded-xl max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 font-catamaran">LATEST LESSON</h1>
      <div className="text-left w-full">
        <p className="text-gray-400 mb-3">
          <strong>Date:</strong> {new Date(data.date).toLocaleDateString()}
        </p>
        <h2 className="text-2xl font-semibold text-[var(--accent-color)] mb-4 font-catamaran">
          <a
            href={data.link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {decodedTitle}
          </a>
        </h2>
        <div
          className="text-[var(--text-color)] mb-6"
          dangerouslySetInnerHTML={{ __html: data.excerpt }}
        />
        <a
          href={data.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[var(--accent-color)] text-[var(--background-color)] py-2 px-4 rounded-lg font-bold transition-all duration-300 ease-in-out hover:bg-opacity-80"
        >
          Read More
        </a>
      </div>
    </div>
  );
}
