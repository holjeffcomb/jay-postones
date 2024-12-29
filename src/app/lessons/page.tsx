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
        _id,
        title,
        subtitle,
        summary,
        description,
        'imageUrl': image.asset->url + '?w=600&h=400&fit=crop',
        videoUrl,
        "lessons": lessons[]->{
          _id,
          title,
          description,
          videoUrl,
          "exercises": exercises[]{
            _id,
            title,
            type,
            description,
            soundsliceUrl,
            videoUrl,
            content
          },
          tags
        },
        level,
        tags,
        membershipLevel,
        _createdAt
      }`,
    individualLessons: `*[_type == "lesson" && isDisplayed == true] | order(_createdAt desc) {
        _id,
        title,
        subtitle,
        summary,
        description,
        sticking,
        timeSignature,
        tempo,
        'imageUrl': lessonImage.asset->url + '?w=600&h=400&fit=crop',
        videoUrl,
        "exercises": exercises[]{
          _id,
          title,
          type,
          description,
          soundsliceUrl,
          videoUrl,
          content[]{
            ...,
            _type == "image" => {
              ...,
              asset,
              alt
            }
          }
        },
        level,
        tags,
        membershipLevel,
        downloadableFile,
        _createdAt
      }`,
    playthroughs: `*[_type == "playthrough"] | order(_createdAt desc) {
        _id,
        title,
        subtitle,
        summary,
        description,
        'imageUrl': image.asset->url + '?w=600&h=400&fit=crop',
        videoUrl,
        songTitle,
        artist,
        tags,
        membershipLevel,
        _createdAt
      }`,
  };

  useEffect(() => {
    const fetchLessons = async () => {
      const fetchedLessons = await client.fetch(queries[bucket]);
      const truncatedLessons = fetchedLessons.map((lesson: any) => ({
        ...lesson,
        description:
          lesson.description.length > 200
            ? lesson.description.slice(0, 200) + " [...]"
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
          className={`text-l ${
            bucket === "courses" ? "font-bold underline" : "font-normal"
          }`}
        >
          Courses
        </button>
        <button
          onClick={() => setBucket("individualLessons")}
          className={`text-l ${
            bucket === "individualLessons"
              ? "font-bold underline"
              : "font-normal"
          }`}
        >
          Individual Lessons
        </button>
        <button
          onClick={() => setBucket("playthroughs")}
          className={`text-l ${
            bucket === "playthroughs" ? "font-bold underline" : "font-normal"
          }`}
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
          <option value="grooves">Grooves</option>
          <option value="drum-fills">Drum Fills</option>
          <option value="tesseract">TesseracT</option>
          <option value="odd-timing">Odd timing</option>
          <option value="polyrhythms">Polyrhythms</option>
          <option value="displacement">Displacement</option>
          <option value="metric-modulation">Metric Modulation</option>
          <option value="single-kick">Single kick</option>
          <option value="double-kick">Double Kick</option>
          <option value="hand-technique">Hand Technique</option>
          <option value="foot-technique">Foot Technique</option>
          <option value="rudiments">Rudiments</option>
          <option value="gear">Gear</option>
          <option value="programming-drums">Programming drums</option>
          <option value="practice-routine">Practice routine</option>
          <option value="technique">Technique</option>
          <option value="flow">Flow</option>
          <option value="limb-independence">Limb Independence</option>
          <option value="ghost-notes">Ghost Notes</option>
          <option value="three">Three</option>
          <option value="five">Five</option>
          <option value="seven">Seven</option>
          <option value="nine">Nine</option>
        </select>
      </div>
      <LessonGrid lessons={lessons} />
    </div>
  );
}
