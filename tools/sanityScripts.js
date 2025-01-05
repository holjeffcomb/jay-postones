import readline from "readline";
import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config({ path: "./.env.local" }); // Load environment variables from .env.local

const projectId = "bcij3qe4";
const dataset = "production";

// Create the Sanity client
const client = createClient({
  projectId: projectId,
  dataset: dataset,
  apiVersion: "2023-08-30",
  token: process.env.SANITY_ADMIN_TOKEN, // Store your token securely
  useCdn: false, // Set to `true` for cached data
  withCredentials: true, // Required for CORS
});

// Function to prompt the user for confirmation
function askForConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${question} (yes/no): `, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === "yes");
    });
  });
}

async function resetExerciseIDs() {
  try {
    // Fetch lessons and their embedded exercises
    const lessons = await client.fetch(`
      *[_type == "lesson"]{
        _id,
        title,
        "exercises": exercises[]{
          _id,
          _type,
          title,
          _createdAt
        }
      }
    `);

    if (lessons.length === 0) {
      console.log("No lessons found. Operation aborted.");
      return;
    }

    console.log(`Found ${lessons.length} lessons.`);

    for (const lesson of lessons) {
      console.log(`Processing lesson: ${lesson.title}`);

      const newExercises = [];

      // Process each exercise in the lesson
      for (let index = 0; index < lesson.exercises.length; index++) {
        const exercise = lesson.exercises[index];
        const newId = `${lesson._id}.${index + 1}`;

        // Create a new exercise with the updated ID
        const newExercise = {
          ...exercise,
          _id: newId,
          _type: "exercise",
          lesson: { _ref: lesson._id, _type: "reference" }, // Link to parent lesson
        };

        await client.createOrReplace(newExercise);
        console.log(`Created new exercise with ID: ${newId}`);
        newExercises.push({ _ref: newId, _type: "reference" }); // Add new reference
      }

      // Update the lesson to use the new exercise references
      await client
        .patch(lesson._id)
        .set({ exercises: newExercises }) // Update exercises array
        .commit();

      console.log(`Updated lesson: ${lesson.title} with new exercises.`);
    }

    // Ask for confirmation before deleting old exercises
    const confirmed = await askForConfirmation(
      "Do you want to delete the old exercises?"
    );
    if (!confirmed) {
      console.log("Old exercises retained. Operation complete.");
      return;
    }

    // Fetch and delete all old exercises
    const oldExercises = await client.fetch(`
      *[_type == "exercise" && !(_id match "*.*")]{
        _id
      }
    `);

    for (const exercise of oldExercises) {
      await client.delete(exercise._id);
      console.log(`Deleted old exercise with ID: ${exercise._id}`);
    }

    console.log("All old exercises deleted successfully.");
  } catch (error) {
    console.error("Error resetting exercise IDs:", error);
  }
}

// Run the script
resetExerciseIDs();
