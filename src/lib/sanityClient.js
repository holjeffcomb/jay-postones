import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

// Create the Sanity client
export const client = createClient({
  projectId: "bcij3qe4",
  dataset: "production",
  apiVersion: "2023-08-30",
  token: process.env.SANITY_API_TOKEN, // Store your token securely
  useCdn: false, // Set to `true` for cached data
  withCredentials: true, // Required for CORS
});

// Set up the image URL builder
const builder = imageUrlBuilder(client);

// Helper function to generate image URLs
export function urlFor(source) {
  return builder.image(source);
}
