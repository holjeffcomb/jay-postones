"use client";

import { useState, useEffect } from "react";
import { client } from "../../lib/sanityClient";
import LessonGrid from "./_components/LessonGrid";

export default function LessonsPage() {
  const [bucket, setBucket] = useState<
    "courses" | "individualLessons" | "playthroughs"
  >("courses");
  const [lessons, setLessons] = useState([]);

  const queries = {
    courses: `*[_type == "course"] | order(_createdAt desc) {
      title,
      description,
      'imageUrl': image.asset->url + '?w=400&h=225&fit=crop',
      videoUrl,
      "lessons": lessons[]->{
        title,
        description,
        videoUrl,
        "exercises": exercises[]{
          title,
          description,
          soundslice
        },
        tags
      },
      level,
      tags,
      _createdAt
    }`,
    individualLessons: `*[_type == "lesson"] | order(_createdAt desc) {
      title,
      description,
      'imageUrl': lessonImage.asset->url + '?w=400&h=225&fit=crop',
      videoUrl,
      "exercises": exercises[]{
        title,
        description,
        soundslice
      },
      level,
      tags,
      _createdAt
    }`,
    playthroughs: `*[_type == "playthrough"] | order(_createdAt desc) {
      title,
      description,
      'imageUrl': image.asset->url + '?w=400&h=225&fit=crop',
      videoUrl,
      songTitle,
      artist,
      tags,
      _createdAt
    }`,
  };

  useEffect(() => {
    const fetchLessons = async () => {
      const fetchedLessons = await client.fetch(queries[bucket]);
      const truncatedLessons = fetchedLessons.map((lesson: any) => ({
        ...lesson,
        description:
          lesson.description.length > 100
            ? lesson.description.slice(0, 70) + " [...]"
            : lesson.description,
      }));
      setLessons(truncatedLessons);
    };

    fetchLessons();
  }, [bucket]);

  return (
    <div className="flex flex-col items-start justify-start p-4 gap-4">
      <div className="flex flex-row relative gap-4">
        <button
          onClick={() => setBucket("courses")}
          className={`text-l ${bucket === "courses" ? "font-bold underline" : "font-normal"}`}
        >
          Courses
        </button>
        <button
          onClick={() => setBucket("individualLessons")}
          className={`text-l ${bucket === "individualLessons" ? "font-bold underline" : "font-normal"}`}
        >
          Individual Lessons
        </button>
        <button
          onClick={() => setBucket("playthroughs")}
          className={`text-l ${bucket === "playthroughs" ? "font-bold underline" : "font-normal"}`}
        >
          Playthroughs
        </button>
      </div>
      <div className="flex flex-row relative gap-4">
        <input
          type="text"
          placeholder="Search lessons..."
          className="p-2 border rounded-md text-black"
        />
        <select className="p-2 border rounded-md text-black">
          <option value="">Select difficulty</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <select className="p-2 border rounded-md text-black">
          <option value="">Select category</option>
          <option value="technique">Technique</option>
          <option value="grooves">Grooves</option>
          <option value="fills">Fills</option>
          <option value="styles">Styles</option>
        </select>
      </div>
      <LessonGrid lessons={lessons} />
    </div>
  );
}
