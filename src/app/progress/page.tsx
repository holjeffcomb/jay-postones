"use client";

import { createClient } from "../utils/supabase/client";
import { useState, useEffect } from "react";

const supabase = createClient();

export default function ProgressPage() {
  const [exercises, setExercises] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      const { data, error } = await supabase
        .from("exercises")
        .select("id, title, lesson_id");
      if (error) {
        console.error("Error fetching exercises:", error);
      } else {
        setExercises(data);
      }
      setLoading(false);
    };

    fetchExercises();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Exercises</h1>
      <ul>
        {exercises?.map((exercise: any) => (
          <li key={exercise.id}>{exercise.title}</li>
        ))}
      </ul>
    </div>
  );
}
