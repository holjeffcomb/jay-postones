"use client";

import { BucketType } from "../page";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
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
  const [areTagsShown, setAreTagsShown] = useState<boolean>(false);

  const tagContainerRef = useRef<HTMLDivElement>(null);
  const [tagContainerHeight, setTagContainerHeight] = useState<number>(0);

  useEffect(() => {
    if (tagContainerRef.current) {
      setTagContainerHeight(
        areTagsShown ? tagContainerRef.current.scrollHeight : 0
      );
    }
  }, [areTagsShown]);

  const tagOptions = [
    "Grooves",
    "Drum Fills",
    "TesseracT",
    "Odd Timing",
    "Polyrhythms",
    "Displacement",
    "Metric Modulation",
    "Single Kick",
    "Double Kick",
    "Heel-Toe",
    "Hand Technique",
    "Foot Technique",
    "Rudiments",
    "Gear",
    "Programming Drums",
    "Practice Routine",
    "Technique",
    "Flow",
    "Limb Independence",
    "Ghost Notes",
    "Triplets",
    "Hertas",
    "Slow",
    "Dynamics",
    "Three",
    "Five",
    "Seven",
    "Nine",
  ];

  // Toggle tag selection
  const handleTagToggle = (tag: string) => {
    setTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  const handleShowTagToggle = () => {
    setAreTagsShown((prev) => !prev);
  };

  const handleClearTags = () => {
    setTags([]);
  };

  // Filtering logic
  useEffect(() => {
    const filtered = items.filter((item) => {
      const matchesTags =
        tags.length === 0 || tags.every((tag) => item.tags?.includes(tag));
      const matchesDifficulty =
        difficulty === "all" || item.level === difficulty;
      const matchesSearchText =
        searchText.trim() === "" ||
        [item.title, item.description, ...(item.tags || [])]
          .join(" ")
          .toLowerCase()
          .includes(searchText.trim().toLowerCase());

      return matchesTags && matchesDifficulty && matchesSearchText;
    });

    setFilteredItems([]); // Temporarily clear items
    setTimeout(() => setFilteredItems(filtered), 50); // Re-add items with animation delay
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
          onChange={(e) => setSearchText(e.target.value)}
        />
        <div className="flex items-center gap-6">
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
          <button
            onClick={handleShowTagToggle}
            className="px-2 py-1 h-7 rounded-lg bg-[var(--accent-color)] text-[var(--primary-color)] text-sm font-normal"
          >
            {areTagsShown ? "Hide Tag Filter" : "Show Tag Filter"}
          </button>
          {tags.length > 0 ? (
            <button onClick={handleClearTags}>Reset Tag Filter</button>
          ) : (
            <></>
          )}
        </div>

        {/* Tag Filter Container with Smooth Expand/Collapse */}
        <div
          ref={tagContainerRef}
          className="flex flex-wrap gap-2 w-[600px] overflow-hidden transition-all duration-500 ease-in-out"
          style={{
            height: tagContainerHeight,
            opacity: areTagsShown ? 1 : 0,
          }}
        >
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
