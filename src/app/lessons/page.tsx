"use client";

import { useState, useEffect } from "react";
import { client } from "../../lib/sanityClient";
import ItemGrid from "./_components/ItemGrid";
import FilterSection from "./_components/FilterSection";
import { GridItem } from "../../../types/types";

export type BucketType = "courses" | "individualLessons" | "playthroughs";

export default function LessonsPage() {
  const [bucket, setBucket] = useState<BucketType>("courses");
  const [items, setItems] = useState<GridItem[]>([]); // Full list of items
  const [filteredItems, setFilteredItems] = useState<GridItem[]>([]); // Filtered items

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
          'imageUrl': lessonImage.asset->url + '?w=600&h=400&fit=crop',
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
        downloadableFiles,
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
      const processedLessons = fetchedLessons.map((lesson: any) => ({
        ...lesson,
        fullDescription: lesson.description, // Keep the original full description
        description:
          lesson.description.length > 200
            ? lesson.description.slice(0, 200) + " [...]"
            : lesson.description,
      }));
      setItems(processedLessons);
      setFilteredItems(processedLessons); // Initially show all items
    };

    fetchLessons();
  }, [bucket]);

  return (
    <div className="flex flex-col items-start justify-start p-4 gap-4">
      <FilterSection
        bucket={bucket}
        setBucket={setBucket}
        items={items} // Pass the full dataset
        setFilteredItems={setFilteredItems} // Update filtered items
      />
      <ItemGrid items={filteredItems} bucket={bucket} />
    </div>
  );
}
