"use client";

import { BucketType } from "../page";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useState } from "react";
import { GridItem } from "../../../../types/types";

interface FilterSectionProps {
  bucket: BucketType;
  setBucket: Dispatch<SetStateAction<BucketType>>;
  items: GridItem[]; // Full list of items
  setFilteredItems: Dispatch<SetStateAction<GridItem[]>>;
}

export default function FilterSection({
  bucket,
  setBucket,
  items,
  setFilteredItems,
}: FilterSectionProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<string>("all");
  const [searchText, setSearchText] = useState<string>("");

  const tagOptions = [
    "Grooves",
    "Drum Fills",
    "TesseracT",
    "Odd timing",
    "Polyrhythms",
    "Displacement",
    "Metric Modulation",
    "Single kick",
    "Double kick",
    "Hand Technique",
    "Foot Technique",
    "Rudiments",
    "Gear",
    "Programming Drums",
    "Practice Routine",
    "Technique",
    "Flow",
    "Limb Independence",
    "Three",
    "Five",
    "Seven",
    "Nine",
  ];

  // Toggle tag selection
  const handleTagToggle = (tag: string) => {
    setTags(
      (prevTags) =>
        prevTags.includes(tag)
          ? prevTags.filter((t) => t !== tag) // Remove tag
          : [...prevTags, tag] // Add tag
    );
  };

  // Filtering logic
  useEffect(() => {
    const filtered = items.filter((item) => {
      // Check if item matches all selected tags
      const matchesTags =
        tags.length === 0 || tags.every((tag) => item.tags?.includes(tag));

      // Check if item matches the selected difficulty
      const matchesDifficulty =
        difficulty === "all" || item.level === difficulty;

      // Check if item matches the search text in title, description, or tags
      const matchesSearchText =
        searchText.trim() === "" ||
        [item.title, item.description, ...(item.tags || [])]
          .join(" ") // Combine title, description, and tags into a single string
          .toLowerCase()
          .includes(searchText.trim().toLowerCase());

      // Return true only if all conditions are satisfied
      return matchesTags && matchesDifficulty && matchesSearchText;
    });

    setFilteredItems(filtered);
  }, [tags, difficulty, searchText, items, setFilteredItems]);

  return (
    <>
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
      <div className="flex flex-col relative gap-4">
        <input
          type="text"
          placeholder="Search lessons..."
          className="p-2 border w-64 rounded-md text-black"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)} // Update search text state
        />
        <select
          className="p-2 border w-48 rounded-md text-black"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="all">All difficulties</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <div className="flex flex-wrap gap-2">
          {tagOptions.map((tag, index) => (
            <button
              key={index}
              onClick={() => handleTagToggle(tag)}
              className={`px-2 py-0 border rounded-lg text-xs transition-colors duration-300 ${
                tags.includes(tag)
                  ? "bg-[var(--secondary-color)] text-[var(--accent-color)]"
                  : "bg-[var(--accent-color)] text-[var(--primary-color)]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
