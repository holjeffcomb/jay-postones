import { NextResponse } from "next/server";
import { client as sanity } from "@/lib/sanityClient";
import { createClient } from "@/app/utils/supabase/client";

const supabase = createClient();

async function fetchSanityData() {
  const courses = await sanity.fetch(
    `*[_type == "course"] { _id, title, description }`
  );
  const lessons = await sanity.fetch(
    `*[_type == "lesson"] { _id, title, "course_id": course._ref, description }`
  );
  const exercises = await sanity.fetch(
    `*[_type == "exercise"] { _id, title, "lesson_id": lesson._ref, description }`
  );
  return { courses, lessons, exercises };
}

async function syncToSupabase() {
  const { courses, lessons, exercises } = await fetchSanityData();

  // Upsert courses
  for (const course of courses) {
    await supabase.from("courses").upsert([
      {
        id: course._id,
        title: course.title,
        description: course.description,
      },
    ]);
  }

  // Upsert lessons
  for (const lesson of lessons) {
    await supabase.from("lessons").upsert([
      {
        id: lesson._id,
        course_id: lesson.course_id || null,
        title: lesson.title,
        description: lesson.description,
      },
    ]);
  }

  // Upsert exercises
  for (const exercise of exercises) {
    await supabase.from("exercises").upsert([
      {
        id: exercise._id,
        lesson_id: exercise.lesson_id || null,
        title: exercise.title,
        description: exercise.description,
      },
    ]);
  }

  console.log("Sanity data synced to Supabase!");
}

export async function POST() {
  try {
    await syncToSupabase();
    return NextResponse.json(
      { message: "Sanity data synced successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Sync failed:", error);
    return NextResponse.json(
      { error: "Failed to sync data." },
      { status: 500 }
    );
  }
}
